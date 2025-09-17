-- Create investment_plans table
-- This table stores different investment plan options available to users

CREATE TABLE public.investment_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Plan Details
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    
    -- Financial Details
    minimum_investment DECIMAL(15,2) NOT NULL DEFAULT 0,
    maximum_investment DECIMAL(15,2),
    expected_annual_return DECIMAL(5,2), -- Percentage (e.g., 8.50 for 8.5%)
    risk_level TEXT CHECK (risk_level IN ('low', 'medium', 'high')) NOT NULL,
    
    -- Plan Configuration
    plan_type TEXT CHECK (plan_type IN ('stocks', 'bonds', 'mixed', 'crypto', 'real_estate', 'commodities')) NOT NULL,
    duration_months INTEGER, -- NULL for open-ended plans
    management_fee_percentage DECIMAL(5,2) DEFAULT 0,
    performance_fee_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Asset Allocation (JSON for flexibility)
    asset_allocation JSONB, -- e.g., {"stocks": 60, "bonds": 30, "cash": 10}
    
    -- Status and Availability
    status TEXT CHECK (status IN ('active', 'inactive', 'coming_soon', 'archived')) DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    requires_approval BOOLEAN DEFAULT false,
    
    -- Investment Limits
    investor_limit INTEGER, -- Maximum number of investors
    current_investors INTEGER DEFAULT 0,
    total_capital_raised DECIMAL(15,2) DEFAULT 0,
    target_capital DECIMAL(15,2),
    
    -- Metadata
    tags TEXT[], -- Array of tags for categorization
    prospectus_url TEXT,
    fact_sheet_url TEXT
);

-- Create updated_at trigger
CREATE TRIGGER investment_plans_updated_at
    BEFORE UPDATE ON public.investment_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX idx_investment_plans_status ON public.investment_plans(status);
CREATE INDEX idx_investment_plans_risk_level ON public.investment_plans(risk_level);
CREATE INDEX idx_investment_plans_plan_type ON public.investment_plans(plan_type);
CREATE INDEX idx_investment_plans_is_featured ON public.investment_plans(is_featured);
CREATE INDEX idx_investment_plans_minimum_investment ON public.investment_plans(minimum_investment);

-- Enable Row Level Security
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- All authenticated users can view active investment plans
CREATE POLICY "Authenticated users can view active plans" ON public.investment_plans
    FOR SELECT USING (
        auth.role() = 'authenticated' AND status = 'active'
    );

-- Admins can manage all investment plans
CREATE POLICY "Admins can manage all plans" ON public.investment_plans
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Create view for public plan information (without sensitive data)
CREATE VIEW public.investment_plans_public AS
SELECT 
    id,
    name,
    description,
    short_description,
    minimum_investment,
    maximum_investment,
    expected_annual_return,
    risk_level,
    plan_type,
    duration_months,
    management_fee_percentage,
    asset_allocation,
    is_featured,
    requires_approval,
    tags
FROM public.investment_plans
WHERE status = 'active';

-- Grant access to the public view
GRANT SELECT ON public.investment_plans_public TO authenticated;