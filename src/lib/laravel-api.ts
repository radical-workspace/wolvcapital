import type {
  User,
  UserProfile,
  InvestmentPlan,
  Transaction,
  UserInvestment,
  AdminApproval,
  InvestmentSummary,
  ApiResponse,
  PaginatedResponse
} from '@/types/laravel'

class LaravelApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api'
    
    // Get token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Auth methods
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const response = await this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      }),
    })
    return response
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: User; token?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    // Store token if provided
    if (response.token && typeof window !== 'undefined') {
      localStorage.setItem('auth_token', response.token)
      this.token = response.token
    }
    
    return response
  }

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST',
    })
    
    // Clear token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
    this.token = null
    
    return response
  }

  // User Profile methods
  async getProfile() {
    const response = await this.request<{ profile: UserProfile }>('/profile')
    return response
  }

  async updateProfile(data: Partial<UserProfile>) {
    const response = await this.request<{ profile: UserProfile }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response
  }

  async getInvestmentSummary() {
    const response = await this.request<{
      summary: InvestmentSummary
      investments: UserInvestment[]
    }>('/profile/investment-summary')
    return response
  }

  // Investment Plans methods
  async getInvestmentPlans(params?: {
    status?: string
    risk_level?: string
    plan_type?: string
    min_investment?: number
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    const response = await this.request<{ plans: PaginatedResponse<InvestmentPlan> }>(
      `/investment-plans${queryString}`
    )
    return response
  }

  async getInvestmentPlan(id: string) {
    const response = await this.request<{ plan: InvestmentPlan }>(`/investment-plans/${id}`)
    return response
  }

  async createInvestmentPlan(data: Partial<InvestmentPlan>) {
    const response = await this.request<{ plan: InvestmentPlan }>('/investment-plans', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  }

  async updateInvestmentPlan(id: string, data: Partial<InvestmentPlan>) {
    const response = await this.request<{ plan: InvestmentPlan }>(`/investment-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response
  }

  async deleteInvestmentPlan(id: string) {
    const response = await this.request(`/investment-plans/${id}`, {
      method: 'DELETE',
    })
    return response
  }

  // Transaction methods
  async getTransactions(params?: {
    type?: string
    status?: string
    page?: number
  }) {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : ''
    const response = await this.request<{ transactions: PaginatedResponse<Transaction> }>(
      `/transactions${queryString}`
    )
    return response
  }

  async getTransaction(id: string) {
    const response = await this.request<{ transaction: Transaction }>(`/transactions/${id}`)
    return response
  }

  async createInvestment(data: {
    investment_plan_id: string
    amount: number
    payment_method: string
    description?: string
  }) {
    const response = await this.request<{ transaction: Transaction }>('/transactions/invest', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  }

  async createWithdrawal(data: {
    user_investment_id: string
    amount: number
    description?: string
  }) {
    const response = await this.request<{ transaction: Transaction }>('/transactions/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response
  }

  // Helper method to set token manually
  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  // Helper method to get current token
  getToken() {
    return this.token
  }

  // Helper method to check if user is authenticated
  isAuthenticated() {
    return !!this.token
  }
}

// Create singleton instance
export const laravelApi = new LaravelApiClient()

// For legacy compatibility, create a supabase-like interface
export const createClient = () => {
  return {
    auth: {
      signUp: async ({ email, password }: { email: string; password: string }) => {
        try {
          const response = await laravelApi.register(email, password)
          return { data: { user: response.user }, error: null }
        } catch (error) {
          return { data: null, error }
        }
      },
      signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
        try {
          const response = await laravelApi.login(email, password)
          return { data: { user: response.user, session: { user: response.user } }, error: null }
        } catch (error) {
          return { data: null, error }
        }
      },
      signOut: async () => {
        try {
          await laravelApi.logout()
          return { error: null }
        } catch (error) {
          return { error }
        }
      },
      getSession: async () => {
        const token = laravelApi.getToken()
        if (token) {
          try {
            const response = await laravelApi.getProfile()
            return { data: { session: { user: response.profile } }, error: null }
          } catch (error) {
            return { data: { session: null }, error: null }
          }
        }
        return { data: { session: null }, error: null }
      },
      onAuthStateChange: (callback: Function) => {
        // This would need to be implemented with a proper auth state management
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
    },
    from: (table: string) => {
      // This would need to be implemented based on the table
      return {
        select: () => ({ data: [], error: null }),
        insert: () => ({ data: [], error: null }),
        update: () => ({ data: [], error: null }),
        delete: () => ({ data: [], error: null }),
      }
    },
  }
}

export default laravelApi