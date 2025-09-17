export * from './database'

// Additional common types
export interface DashboardStats {
  totalInvested: number
  currentValue: number
  totalGains: number
  returnPercentage: number
  activeInvestments: number
}

export interface InvestmentMetrics {
  dailyROI: number
  weeklyROI: number
  monthlyROI: number
  yearlyROI: number
  performance: number
}

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
  investment_updates: boolean
  market_news: boolean
  account_security: boolean
}

export interface PaymentMethod {
  id: string
  type: 'bank_transfer' | 'credit_card' | 'debit_card' | 'crypto'
  name: string
  lastFour?: string
  isDefault: boolean
}

export interface APIResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  status?: string
  type?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  acceptTerms: boolean
}

export interface ProfileForm {
  full_name: string
  phone_number: string
  date_of_birth: string
  address: string
  city: string
  state: string
  postal_code: string
  country: string
  investment_experience: 'beginner' | 'intermediate' | 'advanced'
  risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
  annual_income_range: 'under_50k' | '50k_100k' | '100k_250k' | '250k_500k' | 'over_500k'
}

export interface InvestmentForm {
  investment_plan_id: string
  amount: number
  payment_method: string
  terms_accepted: boolean
}