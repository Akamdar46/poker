export interface User {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
  subscription_tier?: 'free' | 'pro' | 'premium'
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  username?: string
}