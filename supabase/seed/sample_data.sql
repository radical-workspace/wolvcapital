-- Seed data for WolvCapital investment platform
-- This file contains sample data for testing and development

-- Insert sample investment plans
INSERT INTO public.investment_plans (
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
    performance_fee_percentage,
    asset_allocation,
    status,
    is_featured,
    requires_approval,
    target_capital,
    tags
) VALUES 
(
    gen_random_uuid(),
    'Conservative Growth Fund',
    'A low-risk investment plan focused on stable, long-term growth through a diversified portfolio of bonds, dividend-paying stocks, and money market instruments. Perfect for risk-averse investors seeking steady returns.',
    'Low-risk diversified portfolio for steady growth',
    1000.00,
    50000.00,
    6.50,
    'low',
    'mixed',
    12,
    1.25,
    0.00,
    '{"bonds": 60, "stocks": 30, "cash": 10}',
    'active',
    true,
    false,
    1000000.00,
    ARRAY['conservative', 'bonds', 'stable', 'retirement']
),
(
    gen_random_uuid(),
    'Balanced Portfolio Plus',
    'A moderate-risk investment strategy that balances growth potential with stability. This plan invests in a mix of domestic and international stocks, corporate bonds, and REITs to provide balanced returns.',
    'Balanced mix of stocks and bonds for moderate growth',
    2500.00,
    100000.00,
    8.75,
    'medium',
    'mixed',
    24,
    1.50,
    5.00,
    '{"stocks": 55, "bonds": 35, "real_estate": 10}',
    'active',
    true,
    false,
    2500000.00,
    ARRAY['balanced', 'diversified', 'growth', 'international']
),
(
    gen_random_uuid(),
    'Aggressive Growth Strategy',
    'High-growth potential investment plan for experienced investors comfortable with market volatility. Focuses on growth stocks, emerging markets, and alternative investments for maximum returns.',
    'High-growth plan for experienced investors',
    5000.00,
    500000.00,
    12.25,
    'high',
    'stocks',
    36,
    1.75,
    10.00,
    '{"growth_stocks": 70, "emerging_markets": 20, "alternatives": 10}',
    'active',
    false,
    true,
    5000000.00,
    ARRAY['aggressive', 'growth', 'high-return', 'volatile']
),
(
    gen_random_uuid(),
    'Tech Innovation Fund',
    'Specialized investment in technology companies and innovation-driven businesses. Includes established tech giants and promising startups in AI, blockchain, and green technology sectors.',
    'Technology-focused investment for innovation growth',
    3000.00,
    250000.00,
    15.50,
    'high',
    'stocks',
    18,
    2.00,
    15.00,
    '{"tech_stocks": 80, "tech_bonds": 15, "cash": 5}',
    'active',
    true,
    true,
    3000000.00,
    ARRAY['technology', 'innovation', 'AI', 'blockchain', 'startups']
),
(
    gen_random_uuid(),
    'Real Estate Investment Trust',
    'Diversified real estate portfolio including commercial properties, residential developments, and REITs. Provides steady income through rental yields and potential capital appreciation.',
    'Real estate focused investment with rental income',
    10000.00,
    1000000.00,
    9.25,
    'medium',
    'real_estate',
    60,
    2.25,
    0.00,
    '{"commercial_real_estate": 50, "residential": 30, "REITs": 20}',
    'active',
    false,
    true,
    10000000.00,
    ARRAY['real_estate', 'rental_income', 'REITs', 'property']
),
(
    gen_random_uuid(),
    'Cryptocurrency Portfolio',
    'Digital asset investment strategy focusing on established cryptocurrencies and DeFi protocols. High-risk, high-reward investment for crypto-savvy investors.',
    'Cryptocurrency and digital asset investment',
    500.00,
    50000.00,
    25.00,
    'high',
    'crypto',
    12,
    2.50,
    20.00,
    '{"bitcoin": 40, "ethereum": 30, "altcoins": 20, "stablecoins": 10}',
    'active',
    false,
    true,
    1000000.00,
    ARRAY['cryptocurrency', 'bitcoin', 'ethereum', 'DeFi', 'blockchain']
);

-- The actual user data will be created when users sign up through Supabase Auth
-- But we can create some sample admin users for testing

-- Note: In a real application, you would insert actual user data after authentication
-- This is just for demonstration of the approval workflow

-- Sample approval scenarios (these would be created automatically by the system)
INSERT INTO public.admin_approvals (
    approval_type,
    title,
    description,
    status,
    priority,
    request_data
) VALUES 
(
    'investment_plan_creation',
    'New Investment Plan: Green Energy Fund',
    'Request to create a new investment plan focused on renewable energy companies',
    'pending',
    'medium',
    '{"plan_name": "Green Energy Fund", "expected_return": 11.5, "risk_level": "medium"}'
),
(
    'kyc_verification',
    'KYC Review Required',
    'User identity verification requires manual review',
    'under_review',
    'high',
    '{"documents_uploaded": true, "identity_verified": false, "address_verified": true}'
);

-- Create some sample functions for common operations
CREATE OR REPLACE FUNCTION public.get_plan_statistics()
RETURNS TABLE (
    total_plans INTEGER,
    active_plans INTEGER,
    total_capital_raised DECIMAL(15,2),
    average_return DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as total_plans,
        COUNT(CASE WHEN status = 'active' THEN 1 END)::INTEGER as active_plans,
        COALESCE(SUM(total_capital_raised), 0) as total_capital_raised,
        COALESCE(AVG(expected_annual_return), 0) as average_return
    FROM public.investment_plans;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user investment summary
CREATE OR REPLACE FUNCTION public.get_user_investment_summary(user_id UUID)
RETURNS TABLE (
    total_invested DECIMAL(15,2),
    current_value DECIMAL(15,2),
    total_return DECIMAL(15,2),
    return_percentage DECIMAL(5,2),
    active_investments INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ui.total_invested), 0) as total_invested,
        COALESCE(SUM(ui.current_value), 0) as current_value,
        COALESCE(SUM(ui.current_value - ui.total_invested), 0) as total_return,
        CASE 
            WHEN SUM(ui.total_invested) > 0 
            THEN ROUND((SUM(ui.current_value - ui.total_invested) / SUM(ui.total_invested) * 100)::numeric, 2)
            ELSE 0 
        END as return_percentage,
        COUNT(*)::INTEGER as active_investments
    FROM public.user_investments ui
    WHERE ui.user_id = $1 AND ui.status = 'active';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.get_plan_statistics() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_investment_summary(UUID) TO authenticated;