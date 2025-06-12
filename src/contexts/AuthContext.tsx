import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, AuthState, LoginCredentials, SignupCredentials } from '@/types/auth'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id)
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setState({ user: null, loading: false, error: null })
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching profile:', error)
        setState(prev => ({ ...prev, loading: false, error: error.message }))
        return
      }

      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        const user: User = {
          id: authUser.id,
          email: authUser.email!,
          username: profile?.username,
          avatar_url: profile?.avatar_url,
          created_at: authUser.created_at,
          subscription_tier: profile?.subscription_tier || 'free',
        }

        setState({ user, loading: false, error: null })
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error)
      setState(prev => ({ ...prev, loading: false, error: 'Failed to fetch user profile' }))
    }
  }

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { error } = await supabase.auth.signInWithPassword(credentials)
      
      if (error) {
        throw error
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Login failed' 
      }))
      throw error
    }
  }

  const signup = async (credentials: SignupCredentials) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username: credentials.username,
            subscription_tier: 'free',
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Signup failed' 
      }))
      throw error
    }
  }

  const logout = async () => {
    setState(prev => ({ ...prev, loading: true }))
    
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Logout failed' 
      }))
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`,
      })
      
      if (error) {
        throw error
      }
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed')
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}