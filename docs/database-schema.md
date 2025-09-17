# WolvCapital Supabase Schema Documentation

This document describes the database schema for the WolvCapital investment platform, built on Supabase (PostgreSQL).

## Overview

The schema is designed to support a comprehensive investment platform with user management, investment plans, transaction processing, and admin approval workflows.

## Core Tables

### 1. user_profiles

Extends the default Supabase `auth.users` table with investment-specific profile information.

**Key Features:**
- Personal and contact information
- Investment preferences and risk tolerance
- KYC (Know Your Customer) status tracking
- Account status management
- Notification preferences

**Important Fields:**
- `risk_tolerance`: conservative, moderate, aggressive
- `investment_experience`: beginner, intermediate, advanced
- `kyc_status`: pending, in_review, approved, rejected
- `account_status`: active, suspended, closed

### 2. investment_plans

Stores available investment products that users can invest in.

**Key Features:**
- Flexible plan configuration
- Risk level and asset allocation tracking
- Performance and fee structure
- Investor capacity management
- Featured plan promotion

**Important Fields:**
- `plan_type`: stocks, bonds, mixed, crypto, real_estate, commodities
- `risk_level`: low, medium, high
- `asset_allocation`: JSON object with percentage breakdown
- `requires_approval`: Boolean flag for high-risk investments

### 3. transactions

Tracks all financial transactions in the platform.

**Key Features:**
- Multiple transaction types (investment, withdrawal, dividend, etc.)
- Payment method tracking
- Status workflow management
- Fee calculation
- External payment integration support

**Transaction Types:**
- `investment`: User investing money
- `withdrawal`: User withdrawing funds
- `dividend`: Dividend payments
- `fee`: Platform fees
- `transfer_in/out`: Account transfers
- `refund`: Refunded transactions

### 4. user_investments

Tracks ongoing user investments in specific plans.

**Key Features:**
- Real-time value tracking
- Performance metrics calculation
- Units/shares management
- Investment lifecycle tracking

### 5. admin_approvals

Manages approval workflows for various platform actions.

**Key Features:**
- Multi-step approval process
- Priority-based queue management
- Automatic approval triggers
- Audit trail with approval history
- Multiple approver support

**Approval Types:**
- `kyc_verification`: User identity verification
- `large_investment`: High-value investment approval
- `withdrawal_request`: Withdrawal approval
- `account_closure`: Account termination
- `investment_plan_creation`: New plan approval

### 6. approval_history & approval_approvers

Supporting tables for detailed approval workflow tracking.

## Views

### user_portfolio
Complete investment portfolio view for users showing all investments with performance metrics.

### transaction_summary
Aggregated transaction data by user and investment plan.

### pending_approvals_summary
Admin dashboard view for managing pending approvals with urgency indicators.

### investment_plan_performance
Performance analytics for investment plans.

### user_activity_summary
Comprehensive user activity and portfolio overview.

## Key Functions

### Automated Functions

1. **handle_new_user()**: Automatically creates user profile when user signs up
2. **handle_completed_investment()**: Creates investment records when transactions complete
3. **handle_approval_status_change()**: Processes approval workflow changes
4. **check_large_investment_approval()**: Triggers approval for large investments

### Utility Functions

1. **calculate_user_risk_score(user_id)**: Calculates user's risk assessment score
2. **get_recommended_plans(user_id)**: Returns personalized investment recommendations
3. **get_user_investment_summary(user_id)**: User's complete investment summary
4. **get_plan_statistics()**: Platform-wide investment statistics

## Security (Row Level Security)

### Authentication-Based Access
- Users can only access their own data
- Admins have full access to all records
- Public views for general information

### Role-Based Permissions
- `authenticated`: Standard user access
- `admin`: Full administrative access (identified by `raw_user_meta_data->>'role' = 'admin'`)

## Data Flow

### Investment Process
1. User creates investment transaction
2. Large investments trigger automatic approval request
3. Admin reviews and approves/rejects
4. Approved transactions create user_investment records
5. Investment plan statistics updated

### KYC Process
1. User uploads documents
2. System creates KYC approval request
3. Admin reviews documents
4. Approval updates user profile KYC status

## Performance Optimizations

### Indexes
- User-based queries (user_id)
- Status-based filtering
- Date-range queries
- Investment plan lookups
- Approval queue management

### Computed Columns
- `net_amount` in transactions (amount - fees)
- Performance percentages in views
- Risk scores and match algorithms

## Migration Files

1. `20240917000001_create_user_profiles.sql` - User profile management
2. `20240917000002_create_investment_plans.sql` - Investment products
3. `20240917000003_create_transactions.sql` - Transaction processing
4. `20240917000004_create_admin_approvals.sql` - Approval workflows
5. `20240917000005_create_views_and_functions.sql` - Views and utilities

## Setup Instructions

1. Initialize Supabase project
2. Run migrations in order
3. Load seed data for testing
4. Configure environment variables
5. Set up admin users with proper roles

## API Integration

The schema is designed to work seamlessly with Supabase's auto-generated APIs:
- REST API for CRUD operations
- Real-time subscriptions for live updates
- GraphQL API for complex queries
- Edge functions for custom business logic

## Monitoring and Analytics

Key metrics to track:
- Total capital raised
- Investment performance
- User acquisition and retention
- Approval workflow efficiency
- Transaction success rates

This schema provides a solid foundation for a scalable investment platform with proper security, performance, and regulatory compliance considerations.