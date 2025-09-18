# WolvCapital: Supabase to Laravel Migration Guide

This document outlines the migration from Supabase to Laravel for the WolvCapital investment platform.

## Migration Overview

The migration involves:
1. **Backend**: Laravel API replacing Supabase functions and RLS policies
2. **Database**: Laravel migrations replacing Supabase SQL migrations  
3. **Frontend**: Laravel API client replacing Supabase client
4. **Authentication**: Laravel-based auth replacing Supabase Auth

## Architecture Changes

### Before (Supabase)
```
Next.js Frontend → Supabase Client → Supabase Database + Auth + RLS
```

### After (Laravel)
```
Next.js Frontend → Laravel API Client → Laravel Backend → Database
```

## Migration Steps

### 1. Backend Setup

```bash
# Install Laravel dependencies
npm run backend:install

# Create environment file
cp backend/.env.example backend/.env

# Generate application key
cd backend && php artisan key:generate

# Configure database in backend/.env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wolvcapital
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Run migrations
npm run backend:migrate

# Start Laravel development server
npm run backend:serve
```

### 2. Database Migration

The following tables were migrated from Supabase to Laravel:

| Supabase Table | Laravel Migration | Laravel Model |
|----------------|-------------------|---------------|
| `user_profiles` | `create_user_profiles_table` | `UserProfile` |
| `investment_plans` | `create_investment_plans_table` | `InvestmentPlan` |
| `transactions` | `create_transactions_table` | `Transaction` |
| `user_investments` | `create_user_investments_table` | `UserInvestment` |
| `admin_approvals` | `create_admin_approvals_table` | `AdminApproval` |

### 3. API Endpoints

Laravel API endpoints replace Supabase client calls:

| Function | Supabase | Laravel API |
|----------|----------|-------------|
| **Authentication** |
| Register | `supabase.auth.signUp()` | `POST /api/auth/register` |
| Login | `supabase.auth.signInWithPassword()` | `POST /api/auth/login` |
| Logout | `supabase.auth.signOut()` | `POST /api/auth/logout` |
| **User Profile** |
| Get Profile | `supabase.from('user_profiles').select()` | `GET /api/profile` |
| Update Profile | `supabase.from('user_profiles').update()` | `PUT /api/profile` |
| Investment Summary | Custom query | `GET /api/profile/investment-summary` |
| **Investment Plans** |
| List Plans | `supabase.from('investment_plans').select()` | `GET /api/investment-plans` |
| Get Plan | `supabase.from('investment_plans').select()` | `GET /api/investment-plans/{id}` |
| Create Plan | `supabase.from('investment_plans').insert()` | `POST /api/investment-plans` |
| **Transactions** |
| List Transactions | `supabase.from('transactions').select()` | `GET /api/transactions` |
| Create Investment | `supabase.from('transactions').insert()` | `POST /api/transactions/invest` |
| Create Withdrawal | `supabase.from('transactions').insert()` | `POST /api/transactions/withdraw` |

### 4. Frontend Changes

#### Environment Variables
```bash
# Update .env.local
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api

# Legacy Supabase vars can be commented out
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

#### Import Changes
```typescript
// Before (Supabase)
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

// After (Laravel)
import { laravelApi } from '@/lib/laravel-api'
import { useAuth } from '@/hooks/useAuth-laravel'
```

#### API Call Changes
```typescript
// Before (Supabase)
const { data, error } = await supabase
  .from('investment_plans')
  .select('*')
  .eq('status', 'active')

// After (Laravel)
const response = await laravelApi.getInvestmentPlans({ 
  status: 'active' 
})
const { plans } = response
```

## Key Benefits of Migration

### 1. **Better Control**
- Full control over API logic and business rules
- Custom validation and error handling
- Flexible authentication and authorization

### 2. **Improved Security**
- Server-side validation and security rules
- JWT token-based authentication
- Admin role management

### 3. **Enhanced Performance**
- Optimized database queries
- Custom caching strategies
- Reduced API calls with combined endpoints

### 4. **Better Developer Experience**
- Familiar Laravel conventions
- Rich ecosystem of packages
- Better debugging and logging

## Migration Checklist

- [x] Create Laravel backend structure
- [x] Convert Supabase migrations to Laravel migrations
- [x] Create Laravel models with relationships
- [x] Build API controllers for all entities
- [x] Create API routes
- [x] Build Laravel API client for frontend
- [x] Create new authentication system
- [x] Update TypeScript types
- [x] Update environment configuration
- [ ] Migrate existing data (if any)
- [ ] Update all frontend components to use Laravel API
- [ ] Add comprehensive error handling
- [ ] Implement admin authentication middleware
- [ ] Add API rate limiting
- [ ] Create API documentation
- [ ] Add comprehensive tests
- [ ] Deploy Laravel backend
- [ ] Update CI/CD pipelines

## Development Commands

```bash
# Frontend development
npm run dev

# Backend development  
npm run backend:serve

# Database operations
npm run backend:migrate
npm run backend:fresh  # Fresh migration with seeding
npm run backend:seed

# Build and deployment
npm run build
npm run backend:install
```

## Testing the Migration

1. **Start both services:**
   ```bash
   npm run dev          # Frontend on :3000
   npm run backend:serve # Laravel API on :8000
   ```

2. **Test API endpoints:**
   ```bash
   # Register a user
   curl -X POST http://localhost:8000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'

   # Get investment plans
   curl http://localhost:8000/api/investment-plans
   ```

3. **Verify frontend integration:**
   - Open http://localhost:3000
   - Test user registration/login
   - Verify data loading from Laravel API

## Migration Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| **Phase 1**: Backend Setup | 2-3 days | ✅ Complete |
| **Phase 2**: API Development | 3-4 days | ✅ Complete |
| **Phase 3**: Frontend Integration | 2-3 days | 🔄 In Progress |
| **Phase 4**: Testing & Debugging | 2-3 days | ⏳ Pending |
| **Phase 5**: Deployment | 1-2 days | ⏳ Pending |

## Support and Troubleshooting

### Common Issues

1. **CORS Errors**: Configure Laravel CORS middleware
2. **Authentication Issues**: Verify JWT token handling
3. **Database Connection**: Check Laravel .env configuration
4. **API Endpoint 404s**: Verify route registration

### Getting Help

- Check Laravel logs: `backend/storage/logs/laravel.log`
- Enable debug mode: Set `APP_DEBUG=true` in backend/.env
- Review API responses in browser developer tools

---

**WolvCapital** - Successfully migrated from Supabase to Laravel for enhanced control and performance.