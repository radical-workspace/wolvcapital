export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string | null
          phone_number: string | null
          date_of_birth: string | null
          address: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string | null
          investment_experience: 'beginner' | 'intermediate' | 'advanced' | null
          risk_tolerance: 'conservative' | 'moderate' | 'aggressive' | null
          annual_income_range: 'under_50k' | '50k_100k' | '100k_250k' | '250k_500k' | 'over_500k' | null
          kyc_status: 'pending' | 'in_review' | 'approved' | 'rejected' | null
          account_status: 'active' | 'suspended' | 'closed' | null
          notification_preferences: any | null
          avatar_url: string | null
          last_login: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          investment_experience?: 'beginner' | 'intermediate' | 'advanced' | null
          risk_tolerance?: 'conservative' | 'moderate' | 'aggressive' | null
          annual_income_range?: 'under_50k' | '50k_100k' | '100k_250k' | '250k_500k' | 'over_500k' | null
          kyc_status?: 'pending' | 'in_review' | 'approved' | 'rejected' | null
          account_status?: 'active' | 'suspended' | 'closed' | null
          notification_preferences?: any | null
          avatar_url?: string | null
          last_login?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          phone_number?: string | null
          date_of_birth?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          investment_experience?: 'beginner' | 'intermediate' | 'advanced' | null
          risk_tolerance?: 'conservative' | 'moderate' | 'aggressive' | null
          annual_income_range?: 'under_50k' | '50k_100k' | '100k_250k' | '250k_500k' | 'over_500k' | null
          kyc_status?: 'pending' | 'in_review' | 'approved' | 'rejected' | null
          account_status?: 'active' | 'suspended' | 'closed' | null
          notification_preferences?: any | null
          avatar_url?: string | null
          last_login?: string | null
        }
      }
      investment_plans: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          description: string
          short_description: string | null
          minimum_investment: number
          maximum_investment: number | null
          expected_annual_return: number
          risk_level: 'low' | 'medium' | 'high'
          plan_type: 'stocks' | 'bonds' | 'crypto' | 'real_estate' | 'mixed' | 'commodities'
          duration_months: number
          management_fee_percentage: number
          performance_fee_percentage: number | null
          asset_allocation: any | null
          status: 'active' | 'inactive' | 'coming_soon'
          is_featured: boolean
          requires_approval: boolean
          current_investors: number
          total_capital_raised: number
          target_capital: number | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          description: string
          short_description?: string | null
          minimum_investment: number
          maximum_investment?: number | null
          expected_annual_return: number
          risk_level: 'low' | 'medium' | 'high'
          plan_type: 'stocks' | 'bonds' | 'crypto' | 'real_estate' | 'mixed' | 'commodities'
          duration_months: number
          management_fee_percentage: number
          performance_fee_percentage?: number | null
          asset_allocation?: any | null
          status?: 'active' | 'inactive' | 'coming_soon'
          is_featured?: boolean
          requires_approval?: boolean
          current_investors?: number
          total_capital_raised?: number
          target_capital?: number | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          description?: string
          short_description?: string | null
          minimum_investment?: number
          maximum_investment?: number | null
          expected_annual_return?: number
          risk_level?: 'low' | 'medium' | 'high'
          plan_type?: 'stocks' | 'bonds' | 'crypto' | 'real_estate' | 'mixed' | 'commodities'
          duration_months?: number
          management_fee_percentage?: number
          performance_fee_percentage?: number | null
          asset_allocation?: any | null
          status?: 'active' | 'inactive' | 'coming_soon'
          is_featured?: boolean
          requires_approval?: boolean
          current_investors?: number
          total_capital_raised?: number
          target_capital?: number | null
          tags?: string[] | null
        }
      }
      transactions: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          investment_plan_id: string | null
          transaction_type: 'investment' | 'withdrawal' | 'dividend' | 'fee' | 'refund'
          amount: number
          net_amount: number
          fees: number
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          payment_method: string | null
          payment_reference: string | null
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          failure_reason: string | null
          metadata: any | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          investment_plan_id?: string | null
          transaction_type: 'investment' | 'withdrawal' | 'dividend' | 'fee' | 'refund'
          amount: number
          net_amount?: number
          fees?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          payment_method?: string | null
          payment_reference?: string | null
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          failure_reason?: string | null
          metadata?: any | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          investment_plan_id?: string | null
          transaction_type?: 'investment' | 'withdrawal' | 'dividend' | 'fee' | 'refund'
          amount?: number
          net_amount?: number
          fees?: number
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
          payment_method?: string | null
          payment_reference?: string | null
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          failure_reason?: string | null
          metadata?: any | null
        }
      }
      user_investments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          investment_plan_id: string
          initial_amount: number
          total_invested: number
          current_value: number
          unrealized_gains: number
          realized_gains: number
          status: 'active' | 'closed' | 'suspended'
          start_date: string
          end_date: string | null
          last_calculated: string | null
          performance_percentage: number | null
          dividend_earned: number
          fees_paid: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          investment_plan_id: string
          initial_amount: number
          total_invested?: number
          current_value?: number
          unrealized_gains?: number
          realized_gains?: number
          status?: 'active' | 'closed' | 'suspended'
          start_date?: string
          end_date?: string | null
          last_calculated?: string | null
          performance_percentage?: number | null
          dividend_earned?: number
          fees_paid?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          investment_plan_id?: string
          initial_amount?: number
          total_invested?: number
          current_value?: number
          unrealized_gains?: number
          realized_gains?: number
          status?: 'active' | 'closed' | 'suspended'
          start_date?: string
          end_date?: string | null
          last_calculated?: string | null
          performance_percentage?: number | null
          dividend_earned?: number
          fees_paid?: number
        }
      }
      admin_approvals: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          approval_type: 'kyc_verification' | 'large_investment' | 'withdrawal_request' | 'account_closure' | 'investment_plan_creation' | 'user_suspension' | 'document_verification' | 'bank_account_change' | 'high_risk_investment'
          user_id: string | null
          transaction_id: string | null
          investment_plan_id: string | null
          status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled'
          priority: 'low' | 'medium' | 'high' | 'critical'
          assigned_to: string | null
          requested_by: string
          approved_by: string | null
          rejected_by: string | null
          approved_at: string | null
          rejected_at: string | null
          title: string
          description: string | null
          rejection_reason: string | null
          approval_notes: string | null
          request_data: any | null
          tags: string[] | null
          external_reference: string | null
          attachments: any | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          approval_type: 'kyc_verification' | 'large_investment' | 'withdrawal_request' | 'account_closure' | 'investment_plan_creation' | 'user_suspension' | 'document_verification' | 'bank_account_change' | 'high_risk_investment'
          user_id?: string | null
          transaction_id?: string | null
          investment_plan_id?: string | null
          status?: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_to?: string | null
          requested_by: string
          approved_by?: string | null
          rejected_by?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          title: string
          description?: string | null
          rejection_reason?: string | null
          approval_notes?: string | null
          request_data?: any | null
          tags?: string[] | null
          external_reference?: string | null
          attachments?: any | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          approval_type?: 'kyc_verification' | 'large_investment' | 'withdrawal_request' | 'account_closure' | 'investment_plan_creation' | 'user_suspension' | 'document_verification' | 'bank_account_change' | 'high_risk_investment'
          user_id?: string | null
          transaction_id?: string | null
          investment_plan_id?: string | null
          status?: 'pending' | 'under_review' | 'approved' | 'rejected' | 'cancelled'
          priority?: 'low' | 'medium' | 'high' | 'critical'
          assigned_to?: string | null
          requested_by?: string
          approved_by?: string | null
          rejected_by?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          title?: string
          description?: string | null
          rejection_reason?: string | null
          approval_notes?: string | null
          request_data?: any | null
          tags?: string[] | null
          external_reference?: string | null
          attachments?: any | null
        }
      }
    }
    Views: {
      user_portfolio: {
        Row: {
          user_id: string
          full_name: string | null
          total_invested: number | null
          current_value: number | null
          total_gains: number | null
          total_return_percentage: number | null
          active_investments: number | null
          last_investment_date: string | null
        }
      }
      pending_approvals_summary: {
        Row: {
          id: string
          approval_type: string
          user_email: string | null
          user_name: string | null
          title: string
          priority: string
          status: string
          created_at: string
          urgency_status: string
          days_pending: number
        }
      }
      investment_plan_performance: {
        Row: {
          id: string
          name: string
          plan_type: string
          risk_level: string
          current_investors: number
          total_capital_raised: number
          target_capital: number | null
          avg_unrealized_gains: number | null
          avg_performance_percentage: number | null
          total_fees_collected: number | null
        }
      }
    }
    Functions: {
      calculate_user_risk_score: {
        Args: { user_id: string }
        Returns: number
      }
      get_recommended_plans: {
        Args: { user_id: string }
        Returns: {
          plan_id: string
          plan_name: string
          plan_type: string
          risk_level: string
          expected_return: number
          minimum_investment: number
          match_score: number
        }[]
      }
      get_user_investment_summary: {
        Args: { user_id: string }
        Returns: {
          total_invested: number
          current_value: number
          total_gains: number
          return_percentage: number
          active_investments: number
        }
      }
      get_plan_statistics: {
        Args: {}
        Returns: {
          total_plans: number
          total_investors: number
          total_capital: number
          avg_return: number
        }
      }
    }
  }
}

// Auth types
export interface UserMetadata {
  role?: 'user' | 'admin'
  full_name?: string
  avatar_url?: string
}

export interface UserProfile extends Database['public']['Tables']['user_profiles']['Row'] {}
export interface InvestmentPlan extends Database['public']['Tables']['investment_plans']['Row'] {}
export interface Transaction extends Database['public']['Tables']['transactions']['Row'] {}
export interface UserInvestment extends Database['public']['Tables']['user_investments']['Row'] {}
export interface AdminApproval extends Database['public']['Tables']['admin_approvals']['Row'] {}

// Additional utility types
export type TransactionStatus = Database['public']['Tables']['transactions']['Row']['status']
export type ApprovalType = Database['public']['Tables']['admin_approvals']['Row']['approval_type']
export type ApprovalStatus = Database['public']['Tables']['admin_approvals']['Row']['status']
export type RiskLevel = Database['public']['Tables']['investment_plans']['Row']['risk_level']
export type PlanType = Database['public']['Tables']['investment_plans']['Row']['plan_type']
export type AccountStatus = Database['public']['Tables']['user_profiles']['Row']['account_status']
export type KYCStatus = Database['public']['Tables']['user_profiles']['Row']['kyc_status']