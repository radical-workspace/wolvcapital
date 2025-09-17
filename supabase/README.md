# WolvCapital Supabase Setup

This directory contains the complete Supabase database schema and configuration for the WolvCapital investment platform.

## Quick Start

### 1. Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
- PostgreSQL knowledge (helpful)
- Supabase account

### 2. Initialize Project

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Initialize in your project directory
supabase init

# Start local development
supabase start
```

### 3. Apply Migrations

```bash
# Run all migrations
supabase db reset

# Or apply specific migration
supabase db migrate up
```

### 4. Load Sample Data

```bash
# Load seed data for testing
supabase db seed
```

## Project Structure

```
supabase/
├── config.toml           # Supabase configuration
├── migrations/           # Database schema migrations
│   ├── 20240917000001_create_user_profiles.sql
│   ├── 20240917000002_create_investment_plans.sql
│   ├── 20240917000003_create_transactions.sql
│   ├── 20240917000004_create_admin_approvals.sql
│   └── 20240917000005_create_views_and_functions.sql
├── seed/                 # Sample data for development
│   └── sample_data.sql
└── functions/            # Edge functions (if needed)
```

## Database Schema Overview

### Core Tables
1. **user_profiles** - Extended user information
2. **investment_plans** - Available investment products
3. **transactions** - All financial transactions
4. **user_investments** - User's active investments
5. **admin_approvals** - Approval workflow management

### Key Features
- **Row Level Security (RLS)** - Data protection at database level
- **Real-time subscriptions** - Live updates for transactions
- **Automated triggers** - Business logic enforcement
- **Performance optimization** - Proper indexing and views

## Environment Setup

### Local Development

1. Copy environment variables:
```bash
# Copy from Supabase dashboard
cp .env.example .env.local
```

2. Update your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Production Deployment

1. Create Supabase project
2. Link your local project:
```bash
supabase link --project-ref your-project-ref
```

3. Deploy migrations:
```bash
supabase db push
```

## User Roles and Permissions

### Standard Users (`authenticated`)
- View and update own profile
- View available investment plans
- Create investment transactions
- View own portfolio and transactions

### Admin Users
- Manage all user data
- Create and manage investment plans
- Process approvals
- View analytics and reports

### Setting Up Admin Users

```sql
-- Update user metadata to grant admin role
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb 
WHERE email = 'admin@wolvcapital.com';
```

## Key Database Functions

### User Functions
- `get_user_investment_summary(user_id)` - Portfolio summary
- `get_recommended_plans(user_id)` - Personalized recommendations
- `calculate_user_risk_score(user_id)` - Risk assessment

### Admin Functions
- `get_plan_statistics()` - Platform analytics
- `create_automatic_approval()` - Trigger approval workflows
- `log_approval_action()` - Audit trail management

## Security Considerations

### Row Level Security Policies
- Users isolated to own data
- Admin role verification
- Secure function execution

### Data Protection
- Encrypted sensitive data
- Audit trails for all changes
- Compliance with financial regulations

## API Usage Examples

### Get User Portfolio
```javascript
const { data, error } = await supabase
  .from('user_portfolio')
  .select('*')
  .eq('user_id', userId);
```

### Create Investment Transaction
```javascript
const { data, error } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    investment_plan_id: planId,
    transaction_type: 'investment',
    amount: amount,
    payment_method: 'bank_transfer'
  });
```

### Real-time Subscription
```javascript
const subscription = supabase
  .from('transactions')
  .on('UPDATE', payload => {
    console.log('Transaction updated:', payload);
  })
  .eq('user_id', userId)
  .subscribe();
```

## Monitoring and Maintenance

### Regular Tasks
1. Monitor database performance
2. Review approval queues
3. Update investment plan performance
4. Backup critical data

### Analytics Queries
```sql
-- Platform growth
SELECT DATE_TRUNC('month', created_at), COUNT(*) 
FROM user_profiles 
GROUP BY 1 ORDER BY 1;

-- Investment performance
SELECT * FROM investment_plan_performance;

-- Pending approvals
SELECT * FROM pending_approvals_summary;
```

## Troubleshooting

### Common Issues

1. **Migration Failures**
   - Check PostgreSQL logs
   - Verify foreign key constraints
   - Ensure proper permissions

2. **RLS Policy Issues**
   - Verify user authentication
   - Check policy conditions
   - Test with different user roles

3. **Performance Issues**
   - Review query execution plans
   - Check index usage
   - Monitor connection pools

### Support Resources
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- Project documentation in `/docs/database-schema.md`

## Contributing

When adding new features:
1. Create new migration files
2. Update documentation
3. Add appropriate RLS policies
4. Include sample data
5. Test thoroughly

---

For detailed schema documentation, see [Database Schema Documentation](../docs/database-schema.md).