-- Create useful views and additional functions for the investment platform

-- Portfolio view for users to see their complete investment portfolio
CREATE VIEW public.user_portfolio AS
SELECT 
    ui.user_id,
    ui.id as investment_id,
    ip.name as plan_name,
    ip.plan_type,
    ip.risk_level,
    ui.initial_investment,
    ui.current_value,
    ui.total_invested,
    ui.total_withdrawn,
    ui.unrealized_gains,
    ui.realized_gains,
    ui.dividends_received,
    ui.status,
    ui.investment_date,
    ui.maturity_date,
    ui.units,
    ui.unit_price,
    -- Calculate performance metrics
    CASE 
        WHEN ui.total_invested > 0 
        THEN ROUND(((ui.current_value - ui.total_invested) / ui.total_invested * 100)::numeric, 2)
        ELSE 0 
    END as return_percentage,
    CASE 
        WHEN ui.investment_date IS NOT NULL 
        THEN EXTRACT(days FROM (NOW() - ui.investment_date))::integer
        ELSE 0 
    END as days_invested
FROM public.user_investments ui
JOIN public.investment_plans ip ON ui.investment_plan_id = ip.id;

-- Transaction summary view
CREATE VIEW public.transaction_summary AS
SELECT 
    t.user_id,
    t.investment_plan_id,
    ip.name as plan_name,
    COUNT(*) as transaction_count,
    SUM(CASE WHEN t.transaction_type = 'investment' AND t.status = 'completed' THEN t.net_amount ELSE 0 END) as total_invested,
    SUM(CASE WHEN t.transaction_type = 'withdrawal' AND t.status = 'completed' THEN t.net_amount ELSE 0 END) as total_withdrawn,
    SUM(CASE WHEN t.transaction_type = 'dividend' AND t.status = 'completed' THEN t.net_amount ELSE 0 END) as total_dividends,
    SUM(CASE WHEN t.transaction_type = 'fee' AND t.status = 'completed' THEN t.amount ELSE 0 END) as total_fees,
    MIN(t.created_at) as first_transaction,
    MAX(t.created_at) as last_transaction
FROM public.transactions t
LEFT JOIN public.investment_plans ip ON t.investment_plan_id = ip.id
WHERE t.status = 'completed'
GROUP BY t.user_id, t.investment_plan_id, ip.name;

-- Admin dashboard view for pending approvals
CREATE VIEW public.pending_approvals_summary AS
SELECT 
    aa.id,
    aa.approval_type,
    aa.title,
    aa.priority,
    aa.created_at,
    aa.expires_at,
    aa.assigned_to,
    up.first_name || ' ' || up.last_name as user_name,
    up.email,
    CASE 
        WHEN aa.expires_at < NOW() THEN 'expired'
        WHEN aa.escalation_date < NOW() THEN 'escalated'
        WHEN aa.priority = 'critical' THEN 'critical'
        ELSE 'normal'
    END as urgency_status,
    EXTRACT(days FROM (NOW() - aa.created_at))::integer as days_pending
FROM public.admin_approvals aa
LEFT JOIN public.user_profiles up ON aa.user_id = up.id
LEFT JOIN auth.users au ON up.id = au.id
WHERE aa.status IN ('pending', 'under_review')
ORDER BY 
    CASE aa.priority 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
    END,
    aa.created_at;

-- Investment plan performance view
CREATE VIEW public.investment_plan_performance AS
SELECT 
    ip.id,
    ip.name,
    ip.plan_type,
    ip.risk_level,
    ip.current_investors,
    ip.total_capital_raised,
    ip.target_capital,
    COALESCE(AVG(ui.unrealized_gains), 0) as avg_unrealized_gains,
    COALESCE(AVG(
        CASE 
            WHEN ui.total_invested > 0 
            THEN (ui.current_value - ui.total_invested) / ui.total_invested * 100
            ELSE 0 
        END
    ), 0) as avg_return_percentage,
    COUNT(ui.id) as active_investments,
    SUM(ui.current_value) as total_portfolio_value
FROM public.investment_plans ip
LEFT JOIN public.user_investments ui ON ip.id = ui.investment_plan_id AND ui.status = 'active'
WHERE ip.status = 'active'
GROUP BY ip.id, ip.name, ip.plan_type, ip.risk_level, ip.current_investors, ip.total_capital_raised, ip.target_capital;

-- User activity summary view
CREATE VIEW public.user_activity_summary AS
SELECT 
    up.id as user_id,
    up.first_name || ' ' || up.last_name as full_name,
    au.email,
    up.account_status,
    up.kyc_status,
    up.risk_tolerance,
    up.investment_experience,
    COUNT(DISTINCT ui.id) as active_investments,
    COALESCE(SUM(ui.current_value), 0) as total_portfolio_value,
    COALESCE(SUM(ui.total_invested), 0) as total_invested,
    COUNT(DISTINCT t.id) as total_transactions,
    MAX(t.created_at) as last_transaction_date,
    up.created_at as registration_date,
    EXTRACT(days FROM (NOW() - up.created_at))::integer as days_as_customer
FROM public.user_profiles up
LEFT JOIN auth.users au ON up.id = au.id
LEFT JOIN public.user_investments ui ON up.id = ui.user_id AND ui.status = 'active'
LEFT JOIN public.transactions t ON up.id = t.user_id AND t.status = 'completed'
GROUP BY up.id, up.first_name, up.last_name, au.email, up.account_status, up.kyc_status, 
         up.risk_tolerance, up.investment_experience, up.created_at;

-- Function to calculate user's risk score
CREATE OR REPLACE FUNCTION public.calculate_user_risk_score(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    risk_score INTEGER := 0;
    user_profile RECORD;
BEGIN
    SELECT * INTO user_profile 
    FROM public.user_profiles 
    WHERE id = user_id;
    
    IF user_profile IS NULL THEN
        RETURN 0;
    END IF;
    
    -- Risk tolerance scoring
    CASE user_profile.risk_tolerance
        WHEN 'conservative' THEN risk_score := risk_score + 1;
        WHEN 'moderate' THEN risk_score := risk_score + 2;
        WHEN 'aggressive' THEN risk_score := risk_score + 3;
        ELSE risk_score := risk_score + 1;
    END CASE;
    
    -- Investment experience scoring
    CASE user_profile.investment_experience
        WHEN 'beginner' THEN risk_score := risk_score + 1;
        WHEN 'intermediate' THEN risk_score := risk_score + 2;
        WHEN 'advanced' THEN risk_score := risk_score + 3;
        ELSE risk_score := risk_score + 1;
    END CASE;
    
    -- Income range scoring
    CASE user_profile.annual_income_range
        WHEN 'under_50k' THEN risk_score := risk_score + 1;
        WHEN '50k_100k' THEN risk_score := risk_score + 2;
        WHEN '100k_250k' THEN risk_score := risk_score + 3;
        WHEN '250k_500k' THEN risk_score := risk_score + 4;
        WHEN 'over_500k' THEN risk_score := risk_score + 5;
        ELSE risk_score := risk_score + 1;
    END CASE;
    
    RETURN risk_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recommended investment plans for a user
CREATE OR REPLACE FUNCTION public.get_recommended_plans(user_id UUID)
RETURNS TABLE (
    plan_id UUID,
    plan_name TEXT,
    plan_type TEXT,
    risk_level TEXT,
    expected_return DECIMAL(5,2),
    minimum_investment DECIMAL(15,2),
    match_score INTEGER
) AS $$
DECLARE
    user_risk_score INTEGER;
    user_profile RECORD;
BEGIN
    -- Get user profile and risk score
    SELECT * INTO user_profile FROM public.user_profiles WHERE id = user_id;
    user_risk_score := public.calculate_user_risk_score(user_id);
    
    RETURN QUERY
    SELECT 
        ip.id,
        ip.name,
        ip.plan_type,
        ip.risk_level,
        ip.expected_annual_return,
        ip.minimum_investment,
        CASE 
            WHEN ip.risk_level = user_profile.risk_tolerance THEN 3
            WHEN (ip.risk_level = 'medium' AND user_profile.risk_tolerance IN ('conservative', 'aggressive')) THEN 2
            ELSE 1
        END as match_score
    FROM public.investment_plans ip
    WHERE ip.status = 'active'
    AND ip.minimum_investment <= (
        CASE user_profile.annual_income_range
            WHEN 'under_50k' THEN 1000
            WHEN '50k_100k' THEN 5000
            WHEN '100k_250k' THEN 25000
            WHEN '250k_500k' THEN 50000
            WHEN 'over_500k' THEN 100000
            ELSE 1000
        END
    )
    ORDER BY match_score DESC, ip.expected_annual_return DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger large investment approval
CREATE OR REPLACE FUNCTION public.check_large_investment_approval()
RETURNS TRIGGER AS $$
DECLARE
    approval_threshold DECIMAL(15,2) := 10000; -- $10,000 threshold
    user_profile RECORD;
BEGIN
    -- Check if this is a large investment that needs approval
    IF NEW.transaction_type = 'investment' AND NEW.amount >= approval_threshold THEN
        -- Get user profile for context
        SELECT * INTO user_profile FROM public.user_profiles WHERE id = NEW.user_id;
        
        -- Create approval request
        PERFORM public.create_automatic_approval(
            'large_investment',
            NEW.user_id,
            'Large Investment Approval Required',
            'Investment of $' || NEW.amount || ' requires admin approval',
            NEW.id,
            NEW.investment_plan_id,
            json_build_object(
                'amount', NEW.amount,
                'user_kyc_status', user_profile.kyc_status,
                'user_risk_tolerance', user_profile.risk_tolerance
            )
        );
        
        -- Set transaction to pending approval
        NEW.status := 'pending';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for large investment approval
CREATE TRIGGER check_large_investment_approval
    BEFORE INSERT ON public.transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.check_large_investment_approval();

-- Grant appropriate permissions
GRANT SELECT ON public.user_portfolio TO authenticated;
GRANT SELECT ON public.transaction_summary TO authenticated;
GRANT SELECT ON public.investment_plan_performance TO authenticated;

-- Admin-only views
GRANT SELECT ON public.pending_approvals_summary TO authenticated;
GRANT SELECT ON public.user_activity_summary TO authenticated;