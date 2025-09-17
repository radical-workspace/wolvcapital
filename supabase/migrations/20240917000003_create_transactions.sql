-- Create transactions table
-- This table tracks all investment transactions and account activities

CREATE TABLE public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- User and Plan References
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    investment_plan_id UUID REFERENCES public.investment_plans(id) ON DELETE SET NULL,
    
    -- Transaction Details
    transaction_type TEXT CHECK (transaction_type IN (
        'investment', 'withdrawal', 'dividend', 'fee', 'transfer_in', 'transfer_out', 'refund'
    )) NOT NULL,
    
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT DEFAULT 'USD' NOT NULL,
    
    -- Status Tracking
    status TEXT CHECK (status IN (
        'pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'
    )) DEFAULT 'pending',
    
    -- Payment Information
    payment_method TEXT CHECK (payment_method IN (
        'bank_transfer', 'credit_card', 'debit_card', 'wire_transfer', 'crypto', 'internal_transfer'
    )),
    payment_reference TEXT, -- External payment gateway reference
    
    -- Transaction Metadata
    description TEXT,
    notes TEXT, -- Internal notes for admin use
    fees DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount - fees) STORED,
    
    -- Processing Information
    processed_at TIMESTAMP WITH TIME ZONE,
    processed_by UUID REFERENCES auth.users(id), -- Admin who processed
    failure_reason TEXT,
    
    -- External References
    external_transaction_id TEXT, -- Payment gateway transaction ID
    bank_reference TEXT,
    
    -- Metadata
    metadata JSONB -- Flexible storage for additional data
);

-- Create user_investments table to track ongoing investments
CREATE TABLE public.user_investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- References
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    investment_plan_id UUID REFERENCES public.investment_plans(id) ON DELETE CASCADE NOT NULL,
    
    -- Investment Details
    initial_investment DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_invested DECIMAL(15,2) NOT NULL DEFAULT 0, -- Including additional investments
    total_withdrawn DECIMAL(15,2) DEFAULT 0,
    
    -- Performance Tracking
    unrealized_gains DECIMAL(15,2) DEFAULT 0,
    realized_gains DECIMAL(15,2) DEFAULT 0,
    dividends_received DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    status TEXT CHECK (status IN ('active', 'closed', 'suspended')) DEFAULT 'active',
    investment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    maturity_date TIMESTAMP WITH TIME ZONE,
    
    -- Units/Shares
    units DECIMAL(15,8) DEFAULT 1, -- For fund-based investments
    unit_price DECIMAL(15,2) DEFAULT 0,
    
    UNIQUE(user_id, investment_plan_id) -- One investment per plan per user
);

-- Create updated_at triggers
CREATE TRIGGER transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER user_investments_updated_at
    BEFORE UPDATE ON public.user_investments
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for transactions
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_investment_plan_id ON public.transactions(investment_plan_id);
CREATE INDEX idx_transactions_type ON public.transactions(transaction_type);
CREATE INDEX idx_transactions_status ON public.transactions(status);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_transactions_processed_at ON public.transactions(processed_at);

-- Create indexes for user_investments
CREATE INDEX idx_user_investments_user_id ON public.user_investments(user_id);
CREATE INDEX idx_user_investments_plan_id ON public.user_investments(investment_plan_id);
CREATE INDEX idx_user_investments_status ON public.user_investments(status);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transactions
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own transactions (for investment requests)
CREATE POLICY "Users can create investment transactions" ON public.transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        transaction_type IN ('investment', 'withdrawal')
    );

-- Admins can view and manage all transactions
CREATE POLICY "Admins can manage all transactions" ON public.transactions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- RLS Policies for user_investments
-- Users can view their own investments
CREATE POLICY "Users can view own investments" ON public.user_investments
    FOR SELECT USING (auth.uid() = user_id);

-- Admins can view and manage all investments
CREATE POLICY "Admins can manage all investments" ON public.user_investments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Function to create user investment record when investment transaction is completed
CREATE OR REPLACE FUNCTION public.handle_completed_investment()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process investment transactions that are completed
    IF NEW.transaction_type = 'investment' AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
        INSERT INTO public.user_investments (
            user_id, 
            investment_plan_id, 
            initial_investment, 
            current_value, 
            total_invested,
            investment_date
        )
        VALUES (
            NEW.user_id, 
            NEW.investment_plan_id, 
            NEW.net_amount, 
            NEW.net_amount, 
            NEW.net_amount,
            NEW.processed_at
        )
        ON CONFLICT (user_id, investment_plan_id) 
        DO UPDATE SET
            total_invested = user_investments.total_invested + NEW.net_amount,
            current_value = user_investments.current_value + NEW.net_amount,
            updated_at = timezone('utc'::text, now());
            
        -- Update investment plan statistics
        UPDATE public.investment_plans 
        SET 
            current_investors = current_investors + 1,
            total_capital_raised = total_capital_raised + NEW.net_amount
        WHERE id = NEW.investment_plan_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle completed investments
CREATE TRIGGER on_investment_completed
    AFTER UPDATE ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_completed_investment();