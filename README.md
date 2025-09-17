# WolvCapital

**Invest smarter in WolvCapital** - A comprehensive investment platform built with modern web technologies and Supabase.

## Overview

WolvCapital is a full-featured investment platform that enables users to:
- Create and manage investment portfolios
- Access diverse investment plans with different risk levels
- Track performance and returns in real-time
- Manage transactions and withdrawals
- Complete KYC verification and compliance workflows

## Features

### For Investors
- 🏦 **Multiple Investment Plans**: Conservative, balanced, and aggressive growth options
- 📊 **Real-time Portfolio Tracking**: Monitor investments and performance
- 💰 **Flexible Transactions**: Easy deposits, withdrawals, and transfers
- 📈 **Performance Analytics**: Detailed returns and risk analysis
- 🔒 **Secure KYC Process**: Identity verification and compliance

### For Administrators
- 👥 **User Management**: Complete user profile and account oversight
- ✅ **Approval Workflows**: Streamlined approval process for transactions and KYC
- 📋 **Investment Plan Management**: Create and manage investment products
- 📊 **Analytics Dashboard**: Platform performance and user insights
- 🛡️ **Security Controls**: Role-based access and audit trails

## Database Schema

The platform is built on a robust Supabase (PostgreSQL) database with:

### Core Tables
- **user_profiles**: Extended user information and investment preferences
- **investment_plans**: Available investment products and configurations
- **transactions**: All financial transactions and payment processing
- **user_investments**: Active user investment tracking
- **admin_approvals**: Approval workflow management

### Key Features
- Row Level Security (RLS) for data protection
- Automated business logic with triggers and functions
- Real-time subscriptions for live updates
- Performance optimization with proper indexing
- Comprehensive audit trails

## Quick Start

### Database Setup

1. **Initialize Supabase**:
   ```bash
   # Install Supabase CLI
   npm install -g @supabase/cli
   
   # Start local development
   supabase start
   ```

2. **Apply Schema**:
   ```bash
   # Run all migrations
   supabase db reset
   
   # Load sample data
   supabase db seed
   ```

3. **Verify Setup**:
   ```bash
   # Run verification script
   supabase db shell < supabase/verify_schema.sql
   ```

### Environment Configuration

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Project Structure

```
wolvcapital/
├── supabase/                 # Database schema and configuration
│   ├── migrations/          # SQL migration files
│   ├── seed/               # Sample data for development
│   ├── config.toml         # Supabase configuration
│   └── README.md           # Database setup guide
├── docs/                   # Documentation
│   └── database-schema.md  # Detailed schema documentation
└── README.md              # This file
```

## Investment Plans

The platform offers various investment options:

1. **Conservative Growth Fund** (Low Risk)
   - Target Return: 6.5% annually
   - Asset Mix: 60% bonds, 30% stocks, 10% cash
   - Minimum Investment: $1,000

2. **Balanced Portfolio Plus** (Medium Risk)
   - Target Return: 8.75% annually
   - Asset Mix: 55% stocks, 35% bonds, 10% real estate
   - Minimum Investment: $2,500

3. **Aggressive Growth Strategy** (High Risk)
   - Target Return: 12.25% annually
   - Asset Mix: 70% growth stocks, 20% emerging markets, 10% alternatives
   - Minimum Investment: $5,000

4. **Tech Innovation Fund** (High Risk)
   - Target Return: 15.5% annually
   - Focus: Technology companies and innovation-driven businesses
   - Minimum Investment: $3,000

## Security & Compliance

- **Data Protection**: Row-level security at database level
- **Authentication**: Supabase Auth with role-based access
- **Audit Trails**: Complete transaction and approval history
- **KYC Compliance**: Built-in identity verification workflow
- **Financial Regulations**: Designed for regulatory compliance

## API Examples

### Get User Portfolio
```javascript
const { data } = await supabase
  .from('user_portfolio')
  .select('*')
  .eq('user_id', userId);
```

### Create Investment
```javascript
const { data } = await supabase
  .from('transactions')
  .insert({
    user_id: userId,
    investment_plan_id: planId,
    transaction_type: 'investment',
    amount: 5000.00
  });
```

## Documentation

- [Database Schema Documentation](docs/database-schema.md)
- [Supabase Setup Guide](supabase/README.md)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add appropriate tests
5. Update documentation
6. Submit a pull request

## License

This project is proprietary software. All rights reserved.

---

**WolvCapital** - Building the future of smart investing.
