import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          subscription_tier: 'free' | 'pro' | 'premium'
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'premium'
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          subscription_tier?: 'free' | 'pro' | 'premium'
        }
      }
      hand_history: {
        Row: {
          id: string
          user_id: string
          game_state: any
          analysis: any
          action: string
          result: 'win' | 'loss' | 'tie' | null
          profit: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          game_state: any
          analysis: any
          action: string
          result?: 'win' | 'loss' | 'tie' | null
          profit?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          game_state?: any
          analysis?: any
          action?: string
          result?: 'win' | 'loss' | 'tie' | null
          profit?: number | null
          notes?: string | null
          created_at?: string
        }
      }
      player_stats: {
        Row: {
          id: string
          user_id: string
          hands_played: number
          win_rate: number
          profit: number
          vpip: number
          pfr: number
          aggression: number
          tightness: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          hands_played?: number
          win_rate?: number
          profit?: number
          vpip?: number
          pfr?: number
          aggression?: number
          tightness?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          hands_played?: number
          win_rate?: number
          profit?: number
          vpip?: number
          pfr?: number
          aggression?: number
          tightness?: number
          updated_at?: string
        }
      }
    }
  }
}