import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { Card, GameState, HandAnalysis, HandHistory, PlayerStats } from '@/types/poker'
import { analyzeHand } from '@/lib/poker-engine'

interface PokerState {
  gameState: GameState
  currentAnalysis: HandAnalysis | null
  handHistory: HandHistory[]
  playerStats: PlayerStats
  isAnalyzing: boolean
  error: string | null
}

type PokerAction =
  | { type: 'SET_HOLE_CARDS'; payload: Card[] }
  | { type: 'SET_COMMUNITY_CARDS'; payload: Card[] }
  | { type: 'SET_OPPONENTS'; payload: number }
  | { type: 'SET_POT_SIZE'; payload: number }
  | { type: 'SET_BET_TO_CALL'; payload: number }
  | { type: 'SET_POSITION'; payload: GameState['position'] }
  | { type: 'SET_GAME_STAGE'; payload: GameState['gameStage'] }
  | { type: 'SET_STACK_SIZE'; payload: number }
  | { type: 'START_ANALYSIS' }
  | { type: 'SET_ANALYSIS'; payload: HandAnalysis }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'ADD_HAND_HISTORY'; payload: HandHistory }
  | { type: 'UPDATE_PLAYER_STATS'; payload: Partial<PlayerStats> }
  | { type: 'RESET_GAME' }

interface PokerContextType {
  state: PokerState
  setHoleCards: (cards: Card[]) => void
  setCommunityCards: (cards: Card[]) => void
  setOpponents: (count: number) => void
  setPotSize: (size: number) => void
  setBetToCall: (amount: number) => void
  setPosition: (position: GameState['position']) => void
  setGameStage: (stage: GameState['gameStage']) => void
  setStackSize: (size: number) => void
  analyzeCurrentHand: () => Promise<void>
  addHandToHistory: (action: string, result?: 'win' | 'loss' | 'tie', profit?: number) => void
  resetGame: () => void
}

const initialGameState: GameState = {
  holeCards: [],
  communityCards: [],
  opponents: 1,
  potSize: 0,
  betToCall: 0,
  position: 'middle',
  gameStage: 'preflop',
  stackSize: 1000,
}

const initialPlayerStats: PlayerStats = {
  handsPlayed: 0,
  winRate: 0,
  profit: 0,
  vpip: 0,
  pfr: 0,
  aggression: 0,
  tightness: 0,
}

const initialState: PokerState = {
  gameState: initialGameState,
  currentAnalysis: null,
  handHistory: [],
  playerStats: initialPlayerStats,
  isAnalyzing: false,
  error: null,
}

const pokerReducer = (state: PokerState, action: PokerAction): PokerState => {
  switch (action.type) {
    case 'SET_HOLE_CARDS':
      return {
        ...state,
        gameState: { ...state.gameState, holeCards: action.payload },
        error: null,
      }
    case 'SET_COMMUNITY_CARDS':
      return {
        ...state,
        gameState: { ...state.gameState, communityCards: action.payload },
        error: null,
      }
    case 'SET_OPPONENTS':
      return {
        ...state,
        gameState: { ...state.gameState, opponents: action.payload },
        error: null,
      }
    case 'SET_POT_SIZE':
      return {
        ...state,
        gameState: { ...state.gameState, potSize: action.payload },
        error: null,
      }
    case 'SET_BET_TO_CALL':
      return {
        ...state,
        gameState: { ...state.gameState, betToCall: action.payload },
        error: null,
      }
    case 'SET_POSITION':
      return {
        ...state,
        gameState: { ...state.gameState, position: action.payload },
        error: null,
      }
    case 'SET_GAME_STAGE':
      return {
        ...state,
        gameState: { ...state.gameState, gameStage: action.payload },
        error: null,
      }
    case 'SET_STACK_SIZE':
      return {
        ...state,
        gameState: { ...state.gameState, stackSize: action.payload },
        error: null,
      }
    case 'START_ANALYSIS':
      return {
        ...state,
        isAnalyzing: true,
        error: null,
      }
    case 'SET_ANALYSIS':
      return {
        ...state,
        currentAnalysis: action.payload,
        isAnalyzing: false,
        error: null,
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isAnalyzing: false,
      }
    case 'ADD_HAND_HISTORY':
      return {
        ...state,
        handHistory: [action.payload, ...state.handHistory],
      }
    case 'UPDATE_PLAYER_STATS':
      return {
        ...state,
        playerStats: { ...state.playerStats, ...action.payload },
      }
    case 'RESET_GAME':
      return {
        ...state,
        gameState: initialGameState,
        currentAnalysis: null,
        error: null,
      }
    default:
      return state
  }
}

const PokerContext = createContext<PokerContextType | undefined>(undefined)

export const usePoker = () => {
  const context = useContext(PokerContext)
  if (context === undefined) {
    throw new Error('usePoker must be used within a PokerProvider')
  }
  return context
}

export const PokerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pokerReducer, initialState)

  const setHoleCards = useCallback((cards: Card[]) => {
    dispatch({ type: 'SET_HOLE_CARDS', payload: cards })
  }, [])

  const setCommunityCards = useCallback((cards: Card[]) => {
    dispatch({ type: 'SET_COMMUNITY_CARDS', payload: cards })
  }, [])

  const setOpponents = useCallback((count: number) => {
    dispatch({ type: 'SET_OPPONENTS', payload: count })
  }, [])

  const setPotSize = useCallback((size: number) => {
    dispatch({ type: 'SET_POT_SIZE', payload: size })
  }, [])

  const setBetToCall = useCallback((amount: number) => {
    dispatch({ type: 'SET_BET_TO_CALL', payload: amount })
  }, [])

  const setPosition = useCallback((position: GameState['position']) => {
    dispatch({ type: 'SET_POSITION', payload: position })
  }, [])

  const setGameStage = useCallback((stage: GameState['gameStage']) => {
    dispatch({ type: 'SET_GAME_STAGE', payload: stage })
  }, [])

  const setStackSize = useCallback((size: number) => {
    dispatch({ type: 'SET_STACK_SIZE', payload: size })
  }, [])

  const analyzeCurrentHand = useCallback(async () => {
    if (state.gameState.holeCards.length !== 2) {
      dispatch({ type: 'SET_ERROR', payload: 'Please select exactly 2 hole cards' })
      return
    }

    dispatch({ type: 'START_ANALYSIS' })

    try {
      // Simulate API delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const analysis = analyzeHand(state.gameState)
      dispatch({ type: 'SET_ANALYSIS', payload: analysis })
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Analysis failed' 
      })
    }
  }, [state.gameState])

  const addHandToHistory = useCallback((
    action: string, 
    result?: 'win' | 'loss' | 'tie', 
    profit?: number
  ) => {
    if (!state.currentAnalysis) return

    const handHistory: HandHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      gameState: { ...state.gameState },
      analysis: { ...state.currentAnalysis },
      action,
      result,
      profit,
    }

    dispatch({ type: 'ADD_HAND_HISTORY', payload: handHistory })

    // Update player stats
    const newStats: Partial<PlayerStats> = {
      handsPlayed: state.playerStats.handsPlayed + 1,
    }

    if (result && profit !== undefined) {
      const totalProfit = state.playerStats.profit + profit
      const totalHands = state.playerStats.handsPlayed + 1
      const wins = result === 'win' ? 1 : 0
      const currentWins = Math.round(state.playerStats.winRate * state.playerStats.handsPlayed / 100)
      
      newStats.profit = totalProfit
      newStats.winRate = ((currentWins + wins) / totalHands) * 100
    }

    dispatch({ type: 'UPDATE_PLAYER_STATS', payload: newStats })
  }, [state.currentAnalysis, state.gameState, state.playerStats])

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' })
  }, [])

  const value: PokerContextType = {
    state,
    setHoleCards,
    setCommunityCards,
    setOpponents,
    setPotSize,
    setBetToCall,
    setPosition,
    setGameStage,
    setStackSize,
    analyzeCurrentHand,
    addHandToHistory,
    resetGame,
  }

  return <PokerContext.Provider value={value}>{children}</PokerContext.Provider>
}