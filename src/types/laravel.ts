// Laravel API Types
export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  first_name?: string | null
  last_name?: string | null
  date_of_birth?: string | null
  phone_number?: string | null
  street_address?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  risk_tolerance?: 'conservative' | 'moderate' | 'aggressive'
  investment_experience?: 'beginner' | 'intermediate' | 'advanced'
  annual_income_range?: 'under_50k' | '50k_100k' | '100k_250k' | '250k_500k' | 'over_500k' | null
  net_worth_range?: 'under_100k' | '100k_500k' | '500k_1m' | '1m_5m' | 'over_5m' | null
  kyc_status?: 'pending' | 'in_review' | 'approved' | 'rejected'
  account_status?: 'active' | 'suspended' | 'closed'
  email_notifications?: boolean
  sms_notifications?: boolean
  newsletter_subscription?: boolean
  onboarding_completed?: boolean
  terms_accepted_at?: string | null
  privacy_policy_accepted_at?: string | null
  avatar_url?: string | null
  last_login?: string | null
  created_at: string
  updated_at: string
  user?: User
  full_name?: string
}

export interface InvestmentPlan {
  id: string
  name: string
  description?: string | null
  short_description?: string | null
  minimum_investment: number
  maximum_investment?: number | null
  expected_annual_return?: number | null
  risk_level: 'low' | 'medium' | 'high'
  plan_type: 'stocks' | 'bonds' | 'mixed' | 'crypto' | 'real_estate' | 'commodities'
  duration_months?: number | null
  management_fee_percentage: number
  performance_fee_percentage: number
  asset_allocation?: Record<string, number> | null
  status: 'active' | 'inactive' | 'coming_soon' | 'archived'
  is_featured: boolean
  requires_approval: boolean
  investor_limit?: number | null
  current_investors: number
  total_capital_raised: number
  target_capital?: number | null
  additional_info?: Record<string, any> | null
  capital_progress?: number | null
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  investment_plan_id?: string | null
  transaction_type: 'investment' | 'withdrawal' | 'dividend' | 'fee' | 'transfer_in' | 'transfer_out' | 'refund'
  amount: number
  currency: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  payment_method?: 'bank_transfer' | 'credit_card' | 'debit_card' | 'wire_transfer' | 'crypto' | 'internal_transfer' | null
  payment_reference?: string | null
  description?: string | null
  notes?: string | null
  fees: number
  net_amount: number
  processed_at?: string | null
  processed_by?: string | null
  failure_reason?: string | null
  external_transaction_id?: string | null
  bank_reference?: string | null
  metadata?: Record<string, any> | null
  created_at: string
  updated_at: string
  investment_plan?: InvestmentPlan | null
  processed_by_user?: User | null
}

export interface UserInvestment {
  id: string
  user_id: string
  investment_plan_id: string
  initial_investment: number
  current_value: number
  total_invested: number
  total_withdrawn: number
  unrealized_gains: number
  realized_gains: number
  dividends_received: number
  status: 'active' | 'closed' | 'suspended'
  investment_date: string
  maturity_date?: string | null
  shares_units?: number | null
  unit_price?: number | null
  created_at: string
  updated_at: string
  investment_plan?: InvestmentPlan
  total_gains?: number
  total_return_percentage?: number
}

export interface AdminApproval {
  id: string
  approval_type: 'kyc_verification' | 'large_investment' | 'withdrawal_request' | 'account_closure' | 'investment_plan_creation' | 'user_suspension' | 'document_verification' | 'bank_account_change' | 'high_risk_investment'
  user_id?: string | null
  transaction_id?: string | null
  investment_plan_id?: string | null
  requested_by: string
  title: string
  description?: string | null
  request_data?: Record<string, any> | null
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assigned_to?: string | null
  approved_by?: string | null
  rejected_by?: string | null
  approved_at?: string | null
  rejected_at?: string | null
  rejection_reason?: string | null
  approval_notes?: string | null
  tags?: string[] | null
  external_reference?: string | null
  attachments?: Record<string, any> | null
  expires_at?: string | null
  created_at: string
  updated_at: string
  user?: User | null
  transaction?: Transaction | null
  investment_plan?: InvestmentPlan | null
  requester?: User
  assignee?: User | null
  approver?: User | null
  rejector?: User | null
}

export interface InvestmentSummary {
  total_invested: number
  current_value: number
  total_gains: number
  total_return_percentage: number
  investments_count: number
}

export interface ApiResponse<T> {
  message?: string
  error?: string
  messages?: Record<string, string[]>
  data?: T
  [key: string]: any
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}