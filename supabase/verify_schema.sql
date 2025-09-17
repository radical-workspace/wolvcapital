-- Schema verification script
-- This script tests key components of the WolvCapital database schema

DO $$
DECLARE
    test_result TEXT;
    test_count INTEGER := 0;
    pass_count INTEGER := 0;
BEGIN
    RAISE NOTICE 'Starting WolvCapital Schema Verification Tests...';
    RAISE NOTICE '================================================';

    -- Test 1: Check if all main tables exist
    test_count := test_count + 1;
    SELECT COUNT(*) INTO test_result
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_profiles', 'investment_plans', 'transactions', 'user_investments', 'admin_approvals');
    
    IF test_result::INTEGER = 5 THEN
        RAISE NOTICE 'Test 1 PASSED: All main tables exist';
        pass_count := pass_count + 1;
    ELSE
        RAISE NOTICE 'Test 1 FAILED: Expected 5 main tables, found %', test_result;
    END IF;

    -- Test 2: Check if all views exist
    test_count := test_count + 1;
    SELECT COUNT(*) INTO test_result
    FROM information_schema.views
    WHERE table_schema = 'public'
    AND table_name IN ('user_portfolio', 'transaction_summary', 'pending_approvals_summary', 'investment_plan_performance', 'user_activity_summary');
    
    IF test_result::INTEGER = 5 THEN
        RAISE NOTICE 'Test 2 PASSED: All views exist';
        pass_count := pass_count + 1;
    ELSE
        RAISE NOTICE 'Test 2 FAILED: Expected 5 views, found %', test_result;
    END IF;

    -- Test 3: Check if key functions exist
    test_count := test_count + 1;
    SELECT COUNT(*) INTO test_result
    FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name IN ('handle_updated_at', 'calculate_user_risk_score', 'get_recommended_plans', 'create_automatic_approval');
    
    IF test_result::INTEGER >= 4 THEN
        RAISE NOTICE 'Test 3 PASSED: Key functions exist';
        pass_count := pass_count + 1;
    ELSE
        RAISE NOTICE 'Test 3 FAILED: Expected at least 4 key functions, found %', test_result;
    END IF;

    -- Test 4: Check if RLS is enabled on main tables
    test_count := test_count + 1;
    SELECT COUNT(*) INTO test_result
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
    AND c.relname IN ('user_profiles', 'investment_plans', 'transactions', 'user_investments', 'admin_approvals')
    AND c.relrowsecurity = true;
    
    IF test_result::INTEGER = 5 THEN
        RAISE NOTICE 'Test 4 PASSED: RLS enabled on all main tables';
        pass_count := pass_count + 1;
    ELSE
        RAISE NOTICE 'Test 4 FAILED: Expected RLS on 5 tables, found %', test_result;
    END IF;

    -- Test 5: Check if key indexes exist
    test_count := test_count + 1;
    SELECT COUNT(*) INTO test_result
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname LIKE 'idx_%';
    
    IF test_result::INTEGER >= 10 THEN
        RAISE NOTICE 'Test 5 PASSED: Performance indexes exist (% found)', test_result;
        pass_count := pass_count + 1;
    ELSE
        RAISE NOTICE 'Test 5 FAILED: Expected at least 10 indexes, found %', test_result;
    END IF;

    -- Test 6: Check if triggers are properly set up
    test_count := test_count + 1;
    SELECT COUNT(*) INTO test_result
    FROM information_schema.triggers
    WHERE event_object_schema = 'public'
    AND trigger_name LIKE '%updated_at%';
    
    IF test_result::INTEGER >= 3 THEN
        RAISE NOTICE 'Test 6 PASSED: Updated_at triggers exist';
        pass_count := pass_count + 1;
    ELSE
        RAISE NOTICE 'Test 6 FAILED: Expected updated_at triggers, found %', test_result;
    END IF;

    -- Summary
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Test Summary: % out of % tests passed', pass_count, test_count;
    
    IF pass_count = test_count THEN
        RAISE NOTICE 'SUCCESS: All schema verification tests passed!';
    ELSE
        RAISE NOTICE 'WARNING: Some tests failed. Please review the schema.';
    END IF;
    
    RAISE NOTICE '================================================';
END $$;