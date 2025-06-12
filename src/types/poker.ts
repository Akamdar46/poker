export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A'

export interface Card {
  rank: Rank
  suit: Suit
  id: string
}

export interface HandAnalysis {
  handType: string
  handRank: number
  winProbability: number
  tieProbability: number
  lossProbability: number
  potOdds?: number
  impliedOdds?: number
  expectedValue?: number
  recommendation: 'fold' | 'call' | 'raise' | 'all-in'
  confidence: number
  reasoning: string[]
}

export interface GameState {
  holeCards: Card[]
  communityCards: Card[]
  opponents: number
  potSize: number
  betToCall: number
  position: 'early' | 'middle' | 'late' | 'blinds'
  gameStage: 'preflop' | 'flop' | 'turn' | 'river'
  stackSize: number
}

export interface HandHistory {
  id: string
  timestamp: Date
  gameState: GameState
  analysis: HandAnalysis
  action: string
  result?: 'win' | 'loss' | 'tie'
  profit?: number
  notes?: string
}

export interface PlayerStats {
  handsPlayed: number
  winRate: number
  profit: number
  vpip: number // Voluntarily Put In Pot
  pfr: number // Pre-Flop Raise
  aggression: number
  tightness: number
}

export interface SimulationResult {
  wins: number
  ties: number
  losses: number
  totalSimulations: number
  winPercentage: number
  tiePercentage: number
  lossPercentage: number
  equity: number
}

export interface PokerRange {
  hands: string[]
  percentage: number
  description: string
}

export interface GtoRecommendation {
  action: 'fold' | 'call' | 'raise' | 'all-in'
  frequency: number
  sizing?: number
  reasoning: string
  exploitability: number
}