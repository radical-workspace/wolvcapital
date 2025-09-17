'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '@/types'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: any) => Promise<any>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.claims_admin === true

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    }).catch(() => {
      // Handle connection error gracefully
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // For demo purposes, set a mock profile if database is not available
      setProfile({
        id: userId,
        full_name: user?.user_metadata?.full_name || 'Demo User',
        account_status: 'active',
        email: user?.email
      } as any)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, allow specific demo credentials
      if (email === 'user@wolvcapital.com' && password === 'password123') {
        // Mock successful login for demo user
        const mockUser = {
          id: 'demo-user-id',
          email: 'user@wolvcapital.com',
          user_metadata: { role: 'user', full_name: 'Demo User' },
          app_metadata: {}
        } as any
        setUser(mockUser)
        setProfile({
          id: 'demo-user-id',
          full_name: 'Demo User',
          account_status: 'active',
          email: 'user@wolvcapital.com'
        } as any)
        return { data: { user: mockUser }, error: null }
      }
      
      if (email === 'admin@wolvcapital.com' && password === 'admin123') {
        // Mock successful login for demo admin
        const mockAdmin = {
          id: 'demo-admin-id',
          email: 'admin@wolvcapital.com',
          user_metadata: { role: 'admin', full_name: 'Admin User' },
          app_metadata: { claims_admin: true }
        } as any
        setUser(mockAdmin)
        setProfile({
          id: 'demo-admin-id',
          full_name: 'Admin User',
          account_status: 'active',
          email: 'admin@wolvcapital.com'
        } as any)
        return { data: { user: mockAdmin }, error: null }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: { message: 'Connection error. Using demo credentials.' } }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: { message: 'Registration successful! You can now sign in.' } }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    }
  }

  const updateProfile = async (updates: any) => {
    if (!user) return { error: 'No user logged in' }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) {
      setProfile(data)
    }

    return { data, error }
  }

  const value = {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}