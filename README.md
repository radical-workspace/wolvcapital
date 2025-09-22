# WolvCapital

**Invest smarter in WolvCapital** - A comprehensive investment platform built with Next.js frontend and Laravel backend.

## Overview

WolvCapital is a full-featured investment platform that enables users to:
- Create and manage investment portfolios
- Access diverse investment plans with different risk levels
- Track performance and returns in real-time
- Manage transactions and withdrawals
- Complete KYC verification and compliance workflows

## Architecture

### Modern Full-Stack Setup
- **Frontend**: Next.js with TypeScript and Tailwind CSS
- **Backend**: Laravel API with comprehensive REST endpoints
- **Database**: MySQL/PostgreSQL with Laravel Eloquent ORM
- **Authentication**: Laravel-based JWT authentication

### System Architecture
```
Next.js Frontend ↔ Laravel API ↔ Database (MySQL/PostgreSQL)
```

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

The platform is built on a robust Laravel-managed database with:

### Core Tables
- **users**: User authentication and basic info
- **user_profiles**: Extended user information and investment preferences
- **investment_plans**: Available investment products and configurations
- **transactions**: All financial transactions and payment processing
- **user_investments**: Active user investment tracking
- **admin_approvals**: Approval workflow management

### Key Features
- Laravel Eloquent ORM for data relationships
- Database migrations for version control
- Model-based business logic validation
- Comprehensive indexing for performance
- Built-in audit trails and timestamps

## Quick Start

### Prerequisites
- Node.js 18+ for frontend
- PHP 8.2+ for backend
- MySQL or PostgreSQL database
- Composer for PHP dependencies

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd wolvcapital
   ```

2. **Frontend Setup**:
   ```bash
   npm install
   cp .env.example .env.local
   # Update NEXT_PUBLIC_LARAVEL_API_URL in .env.local
   ```

3. **Backend Setup**:
   ```bash
   npm run backend:install
   cp backend/.env.example backend/.env
   # Configure database settings in backend/.env
   cd backend && php artisan key:generate
   ```

4. **Database Setup**:
   ```bash
   npm run backend:migrate
   npm run backend:seed  # Optional: Load sample data
   ```

5. **Start Development Servers**:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend API
   npm run backend:serve
   ```

6. **Access the Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Environment Configuration

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Backend (backend/.env)**:
```env
APP_NAME="WolvCapital API"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wolvcapital
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Project Structure

```
wolvcapital/
├── backend/                   # Laravel API backend
│   ├── app/
│   │   ├── Models/           # Eloquent models
│   │   └── Http/Controllers/Api/ # API controllers
│   ├── database/
│   │   ├── migrations/       # Database migrations
│   │   └── seeders/         # Sample data seeders
│   ├── routes/api.php       # API routes
│   └── config/              # Laravel configuration
├── src/                     # Next.js frontend
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   └── types/               # TypeScript definitions
├── docs/                    # Documentation
│   ├── migration-guide.md   # Migration documentation
│   └── database-schema.md   # Database documentation
└── README.md               # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile/investment-summary` - Get investment summary

### Investment Plans
- `GET /api/investment-plans` - List investment plans
- `GET /api/investment-plans/{id}` - Get specific plan
- `POST /api/investment-plans` - Create plan (admin)
- `PUT /api/investment-plans/{id}` - Update plan (admin)

### Transactions
- `GET /api/transactions` - List user transactions
- `POST /api/transactions/invest` - Create investment
- `POST /api/transactions/withdraw` - Request withdrawal

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

- **Authentication**: Laravel JWT-based authentication
- **Authorization**: Role-based access control (user/admin)
- **Data Validation**: Server-side validation with Laravel
- **Audit Trails**: Complete transaction and approval history
- **KYC Compliance**: Built-in identity verification workflow
- **Financial Regulations**: Designed for regulatory compliance

## API Examples

### Authentication
```javascript
// Register
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe'
  })
})

// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})
```

### Get Investment Plans
```javascript
const response = await fetch('/api/investment-plans?status=active')
const data = await response.json()
console.log(data.plans)
```

### Create Investment
```javascript
const response = await fetch('/api/transactions/invest', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    investment_plan_id: 'plan-uuid',
    amount: 5000.00,
    payment_method: 'bank_transfer'
  })
})
```

## Development Commands

```bash
# Frontend
npm run dev              # Start Next.js development server
npm run build            # Build for production
npm run lint             # Run ESLint

# Backend
npm run backend:serve    # Start Laravel development server
npm run backend:migrate  # Run database migrations
npm run backend:fresh    # Fresh migration with seeding
npm run backend:seed     # Run database seeders

# Combined development
npm run dev && npm run backend:serve  # Start both servers
```

## Documentation

- [Migration Guide](docs/migration-guide.md) - Supabase to Laravel migration details
- [Database Schema Documentation](docs/database-schema.md) - Database structure and relationships

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

**WolvCapital** - Building the future of smart investing with modern technology.
