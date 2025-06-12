import { Card, Rank, Suit, HandAnalysis, SimulationResult, GameState } from '@/types/poker'

// Card utilities
export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']

export const getRankValue = (rank: Rank): number => {
  const values: Record<Rank, number> = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
    'T': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
  }
  return values[rank]
}

export const createCard = (rank: Rank, suit: Suit): Card => ({
  rank,
  suit,
  id: `${rank}${suit}`
})

export const createDeck = (): Card[] => {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(createCard(rank, suit))
    }
  }
  return deck
}

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Hand evaluation
export interface HandRank {
  rank: number
  name: string
  cards: Card[]
  kickers: Card[]
}

export const evaluateHand = (cards: Card[]): HandRank => {
  if (cards.length < 5) {
    throw new Error('Need at least 5 cards to evaluate hand')
  }

  const sortedCards = [...cards].sort((a, b) => getRankValue(b.rank) - getRankValue(a.rank))
  
  // Check for each hand type from highest to lowest
  const straightFlush = checkStraightFlush(sortedCards)
  if (straightFlush) return { rank: 8, name: 'Straight Flush', cards: straightFlush, kickers: [] }

  const fourOfAKind = checkFourOfAKind(sortedCards)
  if (fourOfAKind) return { rank: 7, name: 'Four of a Kind', cards: fourOfAKind.quads, kickers: fourOfAKind.kickers }

  const fullHouse = checkFullHouse(sortedCards)
  if (fullHouse) return { rank: 6, name: 'Full House', cards: fullHouse.trips.concat(fullHouse.pair), kickers: [] }

  const flush = checkFlush(sortedCards)
  if (flush) return { rank: 5, name: 'Flush', cards: flush, kickers: [] }

  const straight = checkStraight(sortedCards)
  if (straight) return { rank: 4, name: 'Straight', cards: straight, kickers: [] }

  const threeOfAKind = checkThreeOfAKind(sortedCards)
  if (threeOfAKind) return { rank: 3, name: 'Three of a Kind', cards: threeOfAKind.trips, kickers: threeOfAKind.kickers }

  const twoPair = checkTwoPair(sortedCards)
  if (twoPair) return { rank: 2, name: 'Two Pair', cards: twoPair.pairs, kickers: twoPair.kickers }

  const onePair = checkOnePair(sortedCards)
  if (onePair) return { rank: 1, name: 'One Pair', cards: onePair.pair, kickers: onePair.kickers }

  // High card
  const highCard = sortedCards.slice(0, 5)
  return { rank: 0, name: 'High Card', cards: highCard, kickers: [] }
}

// Hand checking functions
const checkStraightFlush = (cards: Card[]): Card[] | null => {
  const flush = checkFlush(cards)
  if (!flush) return null
  
  const straight = checkStraight(flush)
  return straight
}

const checkFourOfAKind = (cards: Card[]): { quads: Card[], kickers: Card[] } | null => {
  const rankCounts = countRanks(cards)
  
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count >= 4) {
      const quads = cards.filter(card => card.rank === rank).slice(0, 4)
      const kickers = cards.filter(card => card.rank !== rank).slice(0, 1)
      return { quads, kickers }
    }
  }
  
  return null
}

const checkFullHouse = (cards: Card[]): { trips: Card[], pair: Card[] } | null => {
  const rankCounts = countRanks(cards)
  let trips: Card[] | null = null
  let pair: Card[] | null = null
  
  // Find trips first
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count >= 3) {
      trips = cards.filter(card => card.rank === rank).slice(0, 3)
      break
    }
  }
  
  if (!trips) return null
  
  // Find pair (excluding trips rank)
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (rank !== trips[0].rank && count >= 2) {
      pair = cards.filter(card => card.rank === rank).slice(0, 2)
      break
    }
  }
  
  return trips && pair ? { trips, pair } : null
}

const checkFlush = (cards: Card[]): Card[] | null => {
  const suitCounts: Record<string, Card[]> = {}
  
  for (const card of cards) {
    if (!suitCounts[card.suit]) {
      suitCounts[card.suit] = []
    }
    suitCounts[card.suit].push(card)
  }
  
  for (const suitCards of Object.values(suitCounts)) {
    if (suitCards.length >= 5) {
      return suitCards.slice(0, 5)
    }
  }
  
  return null
}

const checkStraight = (cards: Card[]): Card[] | null => {
  const uniqueRanks = [...new Set(cards.map(card => card.rank))]
  const sortedRanks = uniqueRanks.sort((a, b) => getRankValue(b) - getRankValue(a))
  
  // Check for regular straight
  for (let i = 0; i <= sortedRanks.length - 5; i++) {
    const straightRanks = sortedRanks.slice(i, i + 5)
    if (isConsecutive(straightRanks)) {
      const straightCards = straightRanks.map(rank => 
        cards.find(card => card.rank === rank)!
      )
      return straightCards
    }
  }
  
  // Check for A-2-3-4-5 straight (wheel)
  if (sortedRanks.includes('A') && sortedRanks.includes('2') && 
      sortedRanks.includes('3') && sortedRanks.includes('4') && 
      sortedRanks.includes('5')) {
    const wheelRanks: Rank[] = ['5', '4', '3', '2', 'A']
    const wheelCards = wheelRanks.map(rank => 
      cards.find(card => card.rank === rank)!
    )
    return wheelCards
  }
  
  return null
}

const checkThreeOfAKind = (cards: Card[]): { trips: Card[], kickers: Card[] } | null => {
  const rankCounts = countRanks(cards)
  
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count >= 3) {
      const trips = cards.filter(card => card.rank === rank).slice(0, 3)
      const kickers = cards.filter(card => card.rank !== rank).slice(0, 2)
      return { trips, kickers }
    }
  }
  
  return null
}

const checkTwoPair = (cards: Card[]): { pairs: Card[], kickers: Card[] } | null => {
  const rankCounts = countRanks(cards)
  const pairs: Card[] = []
  
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count >= 2) {
      pairs.push(...cards.filter(card => card.rank === rank).slice(0, 2))
    }
  }
  
  if (pairs.length >= 4) {
    const pairRanks = new Set(pairs.map(card => card.rank))
    const kickers = cards.filter(card => !pairRanks.has(card.rank)).slice(0, 1)
    return { pairs: pairs.slice(0, 4), kickers }
  }
  
  return null
}

const checkOnePair = (cards: Card[]): { pair: Card[], kickers: Card[] } | null => {
  const rankCounts = countRanks(cards)
  
  for (const [rank, count] of Object.entries(rankCounts)) {
    if (count >= 2) {
      const pair = cards.filter(card => card.rank === rank).slice(0, 2)
      const kickers = cards.filter(card => card.rank !== rank).slice(0, 3)
      return { pair, kickers }
    }
  }
  
  return null
}

// Utility functions
const countRanks = (cards: Card[]): Record<string, number> => {
  const counts: Record<string, number> = {}
  for (const card of cards) {
    counts[card.rank] = (counts[card.rank] || 0) + 1
  }
  return counts
}

const isConsecutive = (ranks: Rank[]): boolean => {
  for (let i = 0; i < ranks.length - 1; i++) {
    if (getRankValue(ranks[i]) - getRankValue(ranks[i + 1]) !== 1) {
      return false
    }
  }
  return true
}

// Monte Carlo simulation
export const runSimulation = (
  holeCards: Card[],
  communityCards: Card[],
  opponents: number,
  trials: number = 10000
): SimulationResult => {
  if (holeCards.length !== 2) {
    throw new Error('Must have exactly 2 hole cards')
  }

  const knownCards = [...holeCards, ...communityCards]
  let wins = 0
  let ties = 0
  let losses = 0

  for (let i = 0; i < trials; i++) {
    const deck = createDeck()
    const availableCards = deck.filter(card => 
      !knownCards.some(known => known.id === card.id)
    )
    const shuffled = shuffleDeck(availableCards)

    // Deal remaining community cards
    const remainingCommunity = 5 - communityCards.length
    const fullCommunity = [
      ...communityCards,
      ...shuffled.slice(0, remainingCommunity)
    ]

    // Deal opponent hands
    const opponentHands: Card[][] = []
    let cardIndex = remainingCommunity
    
    for (let j = 0; j < opponents; j++) {
      opponentHands.push([
        shuffled[cardIndex],
        shuffled[cardIndex + 1]
      ])
      cardIndex += 2
    }

    // Evaluate all hands
    const playerHand = evaluateHand([...holeCards, ...fullCommunity])
    const opponentHandRanks = opponentHands.map(hand => 
      evaluateHand([...hand, ...fullCommunity])
    )

    // Compare hands
    const bestOpponent = opponentHandRanks.reduce((best, current) => 
      compareHands(current, best) > 0 ? current : best
    )

    const comparison = compareHands(playerHand, bestOpponent)
    
    if (comparison > 0) {
      wins++
    } else if (comparison === 0) {
      ties++
    } else {
      losses++
    }
  }

  const winPercentage = (wins / trials) * 100
  const tiePercentage = (ties / trials) * 100
  const lossPercentage = (losses / trials) * 100
  const equity = winPercentage + (tiePercentage / 2)

  return {
    wins,
    ties,
    losses,
    totalSimulations: trials,
    winPercentage,
    tiePercentage,
    lossPercentage,
    equity
  }
}

// Compare two hands (-1: hand1 loses, 0: tie, 1: hand1 wins)
export const compareHands = (hand1: HandRank, hand2: HandRank): number => {
  if (hand1.rank !== hand2.rank) {
    return hand1.rank - hand2.rank
  }

  // Same hand rank, compare by high cards
  const cards1 = [...hand1.cards, ...hand1.kickers]
  const cards2 = [...hand2.cards, ...hand2.kickers]

  for (let i = 0; i < Math.min(cards1.length, cards2.length); i++) {
    const value1 = getRankValue(cards1[i].rank)
    const value2 = getRankValue(cards2[i].rank)
    
    if (value1 !== value2) {
      return value1 - value2
    }
  }

  return 0 // Exact tie
}

// Advanced analysis
export const analyzeHand = (gameState: GameState): HandAnalysis => {
  const { holeCards, communityCards, opponents, potSize, betToCall, stackSize } = gameState
  
  // Run simulation
  const simulation = runSimulation(holeCards, communityCards, opponents)
  
  // Calculate pot odds
  const potOdds = betToCall / (potSize + betToCall)
  
  // Calculate implied odds (simplified)
  const impliedOdds = betToCall / (potSize + betToCall + (stackSize * 0.3))
  
  // Calculate expected value
  const callAmount = betToCall
  const winAmount = potSize
  const expectedValue = (simulation.winPercentage / 100) * winAmount - 
                       (simulation.lossPercentage / 100) * callAmount

  // Get current hand strength
  const currentHand = communityCards.length >= 3 ? 
    evaluateHand([...holeCards, ...communityCards]) : 
    { rank: 0, name: 'Unknown', cards: holeCards, kickers: [] }

  // Generate recommendation
  const recommendation = generateRecommendation(
    simulation.equity,
    potOdds,
    expectedValue,
    gameState
  )

  // Generate reasoning
  const reasoning = generateReasoning(simulation, potOdds, expectedValue, gameState)

  return {
    handType: currentHand.name,
    handRank: currentHand.rank,
    winProbability: simulation.winPercentage,
    tieProbability: simulation.tiePercentage,
    lossProbability: simulation.lossPercentage,
    potOdds: potOdds * 100,
    impliedOdds: impliedOdds * 100,
    expectedValue,
    recommendation: recommendation.action,
    confidence: recommendation.confidence,
    reasoning
  }
}

const generateRecommendation = (
  equity: number,
  potOdds: number,
  expectedValue: number,
  gameState: GameState
): { action: 'fold' | 'call' | 'raise' | 'all-in', confidence: number } => {
  const { betToCall, stackSize, gameStage, position } = gameState
  
  // Basic decision tree
  if (expectedValue > 0) {
    if (equity > 80) {
      return { action: 'all-in', confidence: 95 }
    } else if (equity > 60) {
      return { action: 'raise', confidence: 85 }
    } else {
      return { action: 'call', confidence: 75 }
    }
  } else {
    if (equity < 20) {
      return { action: 'fold', confidence: 90 }
    } else if (potOdds > equity / 100) {
      return { action: 'fold', confidence: 70 }
    } else {
      return { action: 'call', confidence: 60 }
    }
  }
}

const generateReasoning = (
  simulation: SimulationResult,
  potOdds: number,
  expectedValue: number,
  gameState: GameState
): string[] => {
  const reasoning: string[] = []
  
  reasoning.push(`Your equity is ${simulation.equity.toFixed(1)}% against ${gameState.opponents} opponent(s)`)
  
  if (expectedValue > 0) {
    reasoning.push(`Positive expected value of $${expectedValue.toFixed(2)}`)
  } else {
    reasoning.push(`Negative expected value of $${expectedValue.toFixed(2)}`)
  }
  
  reasoning.push(`Pot odds: ${(potOdds * 100).toFixed(1)}%`)
  
  if (simulation.equity > 70) {
    reasoning.push('Strong hand with high win probability')
  } else if (simulation.equity > 50) {
    reasoning.push('Decent hand with slight edge')
  } else if (simulation.equity > 30) {
    reasoning.push('Marginal hand requiring careful consideration')
  } else {
    reasoning.push('Weak hand with low win probability')
  }
  
  return reasoning
}