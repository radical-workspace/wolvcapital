'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { laravelApi } from '@/lib/laravel-api'
import type { User, UserProfile } from '@/types/laravel'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string, fullName?: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<any>
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    // Check if user is already authenticated
    const token = laravelApi.getToken()
    if (token) {
      laravelApi.getProfile()
        .then(response => {
          if (response.profile) {
            setProfile(response.profile)
            setUser(response.profile.user || null)
          }
        })
        .catch(() => {
          // Token might be invalid, clear it
          laravelApi.setToken(null)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const response = await laravelApi.login(email, password)
      
      if (response.user) {
        setUser(response.user)
        
        // Get full profile data
        const profileResponse = await laravelApi.getProfile()
        if (profileResponse.profile) {
          setProfile(profileResponse.profile)
        }
      }
      
      return { data: response, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const names = fullName ? fullName.split(' ') : []
      const firstName = names[0] || ''
      const lastName = names.slice(1).join(' ') || ''
      
      const response = await laravelApi.register(email, password, firstName, lastName)
      
      return { data: response, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      await laravelApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await laravelApi.updateProfile(updates)
      
      if (response.profile) {
        setProfile(response.profile)
      }
      
      return { data: response, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}