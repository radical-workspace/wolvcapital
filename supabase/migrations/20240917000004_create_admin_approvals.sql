-- Create admin_approvals table
-- This table manages the approval workflow for various actions in the platform

CREATE TABLE public.admin_approvals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Request Details
    approval_type TEXT CHECK (approval_type IN (
        'kyc_verification',
        'large_investment', 
        'withdrawal_request',
        'account_closure',
        'investment_plan_creation',
        'user_suspension',
        'document_verification',
        'bank_account_change',
        'high_risk_investment'
    )) NOT NULL,
    
    -- Subject References
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE,
    investment_plan_id UUID REFERENCES public.investment_plans(id) ON DELETE CASCADE,
    
    -- Request Information
    requested_by UUID REFERENCES auth.users(id) NOT NULL, -- Who requested the approval
    title TEXT NOT NULL,
    description TEXT,
    request_data JSONB, -- Flexible storage for request-specific data
    
    -- Approval Status
    status TEXT CHECK (status IN (
        'pending', 'under_review', 'approved', 'rejected', 'cancelled', 'expired'
    )) DEFAULT 'pending',
    
    -- Priority and Urgency
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    requires_multiple_approvers BOOLEAN DEFAULT false,
    minimum_approvers INTEGER DEFAULT 1,
    current_approvers INTEGER DEFAULT 0,
    
    -- Processing Information
    assigned_to UUID REFERENCES auth.users(id), -- Admin assigned to review
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id), -- Admin who reviewed
    review_notes TEXT,
    rejection_reason TEXT,
    
    -- Deadlines
    expires_at TIMESTAMP WITH TIME ZONE,
    escalation_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    tags TEXT[],
    external_reference TEXT,
    attachments JSONB -- URLs to supporting documents
);

-- Create approval_history table to track approval workflow
CREATE TABLE public.approval_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- References
    approval_id UUID REFERENCES public.admin_approvals(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Who made the action
    
    -- Action Details
    action TEXT CHECK (action IN (
        'created', 'assigned', 'reviewed', 'approved', 'rejected', 
        'escalated', 'cancelled', 'commented', 'updated'
    )) NOT NULL,
    
    previous_status TEXT,
    new_status TEXT,
    comment TEXT,
    
    -- Metadata
    metadata JSONB
);

-- Create approval_approvers table for multiple approver scenarios
CREATE TABLE public.approval_approvers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- References
    approval_id UUID REFERENCES public.admin_approvals(id) ON DELETE CASCADE NOT NULL,
    approver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Approval Details
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    approved_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    
    UNIQUE(approval_id, approver_id)
);

-- Create updated_at triggers
CREATE TRIGGER admin_approvals_updated_at
    BEFORE UPDATE ON public.admin_approvals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes
CREATE INDEX idx_admin_approvals_status ON public.admin_approvals(status);
CREATE INDEX idx_admin_approvals_type ON public.admin_approvals(approval_type);
CREATE INDEX idx_admin_approvals_user_id ON public.admin_approvals(user_id);
CREATE INDEX idx_admin_approvals_assigned_to ON public.admin_approvals(assigned_to);
CREATE INDEX idx_admin_approvals_priority ON public.admin_approvals(priority);
CREATE INDEX idx_admin_approvals_created_at ON public.admin_approvals(created_at);
CREATE INDEX idx_admin_approvals_expires_at ON public.admin_approvals(expires_at);

CREATE INDEX idx_approval_history_approval_id ON public.approval_history(approval_id);
CREATE INDEX idx_approval_history_user_id ON public.approval_history(user_id);
CREATE INDEX idx_approval_history_created_at ON public.approval_history(created_at);

CREATE INDEX idx_approval_approvers_approval_id ON public.approval_approvers(approval_id);
CREATE INDEX idx_approval_approvers_approver_id ON public.approval_approvers(approver_id);
CREATE INDEX idx_approval_approvers_status ON public.approval_approvers(status);

-- Enable Row Level Security
ALTER TABLE public.admin_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_approvers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_approvals
-- Users can view approvals related to them
CREATE POLICY "Users can view own related approvals" ON public.admin_approvals
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.uid() = requested_by OR
        auth.uid() IN (SELECT approver_id FROM public.approval_approvers WHERE approval_id = admin_approvals.id)
    );

-- Admins can view and manage all approvals
CREATE POLICY "Admins can manage all approvals" ON public.admin_approvals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- RLS Policies for approval_history
-- Users can view history of their related approvals
CREATE POLICY "Users can view related approval history" ON public.approval_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.admin_approvals 
            WHERE admin_approvals.id = approval_history.approval_id 
            AND (
                admin_approvals.user_id = auth.uid() OR 
                admin_approvals.requested_by = auth.uid()
            )
        )
    );

-- Admins can view all approval history
CREATE POLICY "Admins can view all approval history" ON public.approval_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- RLS Policies for approval_approvers
-- Approvers can view and update their approval status
CREATE POLICY "Approvers can manage their approvals" ON public.approval_approvers
    FOR ALL USING (auth.uid() = approver_id);

-- Admins can manage all approver assignments
CREATE POLICY "Admins can manage all approver assignments" ON public.approval_approvers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Function to log approval actions
CREATE OR REPLACE FUNCTION public.log_approval_action(
    approval_id UUID,
    action TEXT,
    comment TEXT DEFAULT NULL,
    previous_status TEXT DEFAULT NULL,
    new_status TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    history_id UUID;
BEGIN
    INSERT INTO public.approval_history (
        approval_id,
        user_id,
        action,
        previous_status,
        new_status,
        comment
    )
    VALUES (
        approval_id,
        auth.uid(),
        action,
        previous_status,
        new_status,
        comment
    )
    RETURNING id INTO history_id;
    
    RETURN history_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle approval status changes
CREATE OR REPLACE FUNCTION public.handle_approval_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Log the status change
    IF OLD.status != NEW.status THEN
        PERFORM public.log_approval_action(
            NEW.id,
            'updated',
            NEW.review_notes,
            OLD.status,
            NEW.status
        );
        
        -- Handle specific status changes
        IF NEW.status = 'approved' THEN
            -- Handle approved transactions
            IF NEW.transaction_id IS NOT NULL THEN
                UPDATE public.transactions 
                SET status = 'processing'
                WHERE id = NEW.transaction_id AND status = 'pending';
            END IF;
            
            -- Handle approved KYC
            IF NEW.approval_type = 'kyc_verification' THEN
                UPDATE public.user_profiles 
                SET kyc_status = 'approved'
                WHERE id = NEW.user_id;
            END IF;
            
        ELSIF NEW.status = 'rejected' THEN
            -- Handle rejected transactions
            IF NEW.transaction_id IS NOT NULL THEN
                UPDATE public.transactions 
                SET status = 'cancelled', failure_reason = NEW.rejection_reason
                WHERE id = NEW.transaction_id;
            END IF;
            
            -- Handle rejected KYC
            IF NEW.approval_type = 'kyc_verification' THEN
                UPDATE public.user_profiles 
                SET kyc_status = 'rejected'
                WHERE id = NEW.user_id;
            END IF;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle approval status changes
CREATE TRIGGER on_approval_status_change
    AFTER UPDATE ON public.admin_approvals
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_approval_status_change();

-- Function to automatically create approval requests for certain actions
CREATE OR REPLACE FUNCTION public.create_automatic_approval(
    approval_type TEXT,
    user_id UUID,
    title TEXT,
    description TEXT DEFAULT NULL,
    transaction_id UUID DEFAULT NULL,
    investment_plan_id UUID DEFAULT NULL,
    request_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    approval_id UUID;
BEGIN
    INSERT INTO public.admin_approvals (
        approval_type,
        user_id,
        transaction_id,
        investment_plan_id,
        requested_by,
        title,
        description,
        request_data
    )
    VALUES (
        approval_type,
        user_id,
        transaction_id,
        investment_plan_id,
        COALESCE(auth.uid(), user_id),
        title,
        description,
        request_data
    )
    RETURNING id INTO approval_id;
    
    -- Log the creation
    PERFORM public.log_approval_action(approval_id, 'created');
    
    RETURN approval_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;