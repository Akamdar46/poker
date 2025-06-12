"""
Advanced poker engine with comprehensive analysis capabilities.
"""
import random
import itertools
from typing import List, Tuple, Dict, Optional, Any
from collections import defaultdict, Counter
from dataclasses import dataclass
from enum import Enum

from .poker_math import (
    PokerMath, AdvancedEquityCalculator, RangeAnalyzer, 
    GameTheoryOptimal, BankrollManagement, TournamentMath,
    PokerOdds, HandEquity, HandStrength
)
from .engine import evaluate_best_hand, parse_cards

class GameType(Enum):
    CASH = "cash"
    TOURNAMENT = "tournament"
    SIT_AND_GO = "sit_and_go"

class Position(Enum):
    EARLY = "early"
    MIDDLE = "middle"
    LATE = "late"
    BUTTON = "button"
    SMALL_BLIND = "small_blind"
    BIG_BLIND = "big_blind"

@dataclass
class GameState:
    """Complete game state information."""
    hole_cards: List[str]
    community_cards: List[str]
    pot_size: float
    stack_size: float
    position: Position
    num_opponents: int
    game_type: GameType
    blinds: Tuple[float, float]  # (small_blind, big_blind)
    antes: float = 0.0
    players_left: int = 9
    paid_spots: int = 0
    prize_pool: List[float] = None

@dataclass
class OpponentProfile:
    """Opponent behavioral profile."""
    vpip: float = 0.25  # Voluntarily put money in pot
    pfr: float = 0.18   # Pre-flop raise
    aggression: float = 0.5  # Aggression factor
    fold_to_cbet: float = 0.6  # Fold to continuation bet
    fold_to_3bet: float = 0.7  # Fold to 3-bet
    steal_attempt: float = 0.3  # Steal attempt frequency
    fold_to_steal: float = 0.8  # Fold to steal attempt

@dataclass
class AdvancedAnalysis:
    """Comprehensive poker analysis result."""
    hand_strength: str
    raw_equity: float
    adjusted_equity: float
    pot_odds: float
    implied_odds: float
    reverse_implied_odds: float
    fold_equity: float
    expected_value: float
    optimal_action: str
    bet_sizing: float
    bluff_frequency: float
    gto_strategy: Dict[str, float]
    bankroll_recommendation: str
    risk_assessment: str
    detailed_breakdown: Dict[str, Any]

class AdvancedPokerEngine:
    """Advanced poker engine with comprehensive analysis."""
    
    def __init__(self):
        self.poker_math = PokerMath()
        self.equity_calculator = AdvancedEquityCalculator()
        self.range_analyzer = RangeAnalyzer()
        self.gto_calculator = GameTheoryOptimal()
        self.bankroll_manager = BankrollManagement()
        self.tournament_math = TournamentMath()
        
        # Cache for expensive calculations
        self.equity_cache = {}
        self.range_cache = {}
    
    def analyze_comprehensive(self, game_state: GameState, 
                            opponent_profile: OpponentProfile = None,
                            bankroll: float = 10000.0) -> AdvancedAnalysis:
        """Perform comprehensive poker analysis."""
        
        if opponent_profile is None:
            opponent_profile = OpponentProfile()
        
        # Basic hand evaluation
        hand_type, hand_score = evaluate_best_hand(
            game_state.hole_cards, game_state.community_cards
        )
        
        # Calculate raw equity
        raw_equity = self._calculate_raw_equity(
            game_state.hole_cards, game_state.community_cards, 
            game_state.num_opponents
        )
        
        # Calculate adjusted equity
        hand_equity = self.equity_calculator.calculate_adjusted_equity(
            raw_equity, game_state.position.value, 
            game_state.stack_size, game_state.pot_size,
            self._profile_to_dict(opponent_profile)
        )
        
        # Calculate various odds
        pot_odds = self.poker_math.calculate_pot_odds(
            game_state.pot_size, game_state.stack_size * 0.1
        )
        
        implied_odds = self.poker_math.calculate_implied_odds(
            game_state.pot_size, game_state.stack_size * 0.1,
            game_state.stack_size * 0.5, raw_equity
        )
        
        reverse_implied_odds = self.poker_math.calculate_reverse_implied_odds(
            raw_equity, self._analyze_board_texture(game_state.community_cards),
            game_state.position.value
        )
        
        fold_equity = self.poker_math.calculate_fold_equity(
            opponent_profile.fold_to_cbet, game_state.pot_size
        )
        
        # Calculate expected value
        expected_value = self.poker_math.calculate_expected_value(
            raw_equity, 0.05, game_state.pot_size, game_state.stack_size * 0.1
        )
        
        # Determine optimal action and bet sizing
        optimal_action, bet_sizing = self._determine_optimal_action(
            game_state, hand_equity, opponent_profile
        )
        
        # Calculate optimal bluff frequency
        bluff_frequency = self.poker_math.calculate_bluff_frequency(
            game_state.pot_size, bet_sizing
        )
        
        # Calculate GTO strategy
        our_range = self._estimate_our_range(game_state)
        opponent_range = self._estimate_opponent_range(game_state, opponent_profile)
        
        gto_strategy = self.gto_calculator.calculate_gto_strategy(
            game_state.position.value, 
            game_state.stack_size / (game_state.blinds[0] + game_state.blinds[1]),
            game_state.pot_size, our_range, opponent_range
        )
        
        # Bankroll management
        bankroll_recommendation = self._get_bankroll_recommendation(
            game_state, raw_equity, bankroll
        )
        
        # Risk assessment
        risk_assessment = self._assess_risk(game_state, hand_equity, opponent_profile)
        
        # Detailed breakdown
        detailed_breakdown = self._create_detailed_breakdown(
            game_state, hand_equity, opponent_profile
        )
        
        return AdvancedAnalysis(
            hand_strength=hand_type,
            raw_equity=raw_equity,
            adjusted_equity=hand_equity.adjusted_equity,
            pot_odds=pot_odds,
            implied_odds=implied_odds,
            reverse_implied_odds=reverse_implied_odds,
            fold_equity=fold_equity,
            expected_value=expected_value,
            optimal_action=optimal_action,
            bet_sizing=bet_sizing,
            bluff_frequency=bluff_frequency,
            gto_strategy=gto_strategy,
            bankroll_recommendation=bankroll_recommendation,
            risk_assessment=risk_assessment,
            detailed_breakdown=detailed_breakdown
        )
    
    def _calculate_raw_equity(self, hole_cards: List[str], 
                            community_cards: List[str], 
                            num_opponents: int, trials: int = 10000) -> float:
        """Calculate raw equity using Monte Carlo simulation."""
        cache_key = (tuple(hole_cards), tuple(community_cards), num_opponents)
        
        if cache_key in self.equity_cache:
            return self.equity_cache[cache_key]
        
        # Use existing engine function but extract just win probability
        from .engine import estimate_win_probability
        win_prob, tie_prob, loss_prob = estimate_win_probability(
            hole_cards, community_cards, num_opponents=num_opponents, trials=trials
        )
        
        equity = win_prob + (tie_prob * 0.5)
        self.equity_cache[cache_key] = equity
        return equity
    
    def _profile_to_dict(self, profile: OpponentProfile) -> Dict[str, float]:
        """Convert opponent profile to dictionary."""
        return {
            'vpip': profile.vpip,
            'pfr': profile.pfr,
            'aggression': profile.aggression,
            'fold_to_bet': profile.fold_to_cbet,
            'fold_to_3bet': profile.fold_to_3bet
        }
    
    def _analyze_board_texture(self, community_cards: List[str]) -> str:
        """Analyze board texture (dry, wet, coordinated)."""
        if len(community_cards) < 3:
            return "preflop"
        
        # Extract suits and ranks
        suits = [card[-1] for card in community_cards]
        ranks = [card[:-1] for card in community_cards]
        
        # Count suits and ranks
        suit_counts = Counter(suits)
        rank_counts = Counter(ranks)
        
        # Check for flush draws
        max_suit_count = max(suit_counts.values()) if suit_counts else 0
        
        # Check for straight possibilities
        rank_values = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10}
        for i, rank in enumerate(['9', '8', '7', '6', '5', '4', '3', '2']):
            rank_values[rank] = 9 - i
        
        numeric_ranks = sorted([rank_values.get(rank, 0) for rank in ranks])
        
        # Check for straight draws
        has_straight_draw = False
        for i in range(len(numeric_ranks) - 1):
            if numeric_ranks[i+1] - numeric_ranks[i] <= 2:
                has_straight_draw = True
                break
        
        # Determine texture
        if max_suit_count >= 3 or has_straight_draw:
            return "wet"
        elif len(set(ranks)) == len(ranks) and max_suit_count <= 2:
            return "dry"
        else:
            return "coordinated"
    
    def _determine_optimal_action(self, game_state: GameState, 
                                hand_equity: HandEquity,
                                opponent_profile: OpponentProfile) -> Tuple[str, float]:
        """Determine optimal action and bet sizing."""
        
        equity = hand_equity.adjusted_equity
        position_strength = 1.0 if game_state.position in [Position.BUTTON, Position.LATE] else 0.8
        
        # Simplified decision tree
        if equity > 0.8:
            # Very strong hand - bet for value
            bet_size = game_state.pot_size * 0.75
            return "raise", bet_size
        elif equity > 0.6:
            # Strong hand - bet for value or call
            if position_strength > 0.8:
                bet_size = game_state.pot_size * 0.6
                return "raise", bet_size
            else:
                return "call", 0.0
        elif equity > 0.4:
            # Marginal hand - position dependent
            if position_strength > 0.8 and opponent_profile.fold_to_cbet > 0.6:
                bet_size = game_state.pot_size * 0.5
                return "raise", bet_size
            else:
                return "call", 0.0
        elif equity > 0.25:
            # Weak hand - fold or bluff
            if (position_strength > 0.8 and 
                opponent_profile.fold_to_cbet > 0.7 and 
                hand_equity.bluff_value > 0.15):
                bet_size = game_state.pot_size * 0.4
                return "raise", bet_size
            else:
                return "fold", 0.0
        else:
            # Very weak hand - fold
            return "fold", 0.0
    
    def _estimate_our_range(self, game_state: GameState) -> List[str]:
        """Estimate our playing range based on position and game state."""
        position = game_state.position
        
        # Simplified range estimation
        if position in [Position.EARLY]:
            return ['AA', 'KK', 'QQ', 'JJ', 'AKs', 'AKo', 'AQs']
        elif position in [Position.MIDDLE]:
            return ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'KQs']
        else:  # Late position
            return ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AKo', 'AQs', 'AQo', 
                   'AJs', 'AJo', 'ATs', 'KQs', 'KQo', 'KJs', 'QJs']
    
    def _estimate_opponent_range(self, game_state: GameState, 
                               opponent_profile: OpponentProfile) -> List[str]:
        """Estimate opponent's range based on their profile."""
        
        # Adjust range based on VPIP
        if opponent_profile.vpip > 0.3:  # Loose player
            return ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
                   'AKs', 'AKo', 'AQs', 'AQo', 'AJs', 'AJo', 'ATs', 'ATo',
                   'KQs', 'KQo', 'KJs', 'KJo', 'KTs', 'QJs', 'QJo', 'QTs']
        elif opponent_profile.vpip < 0.15:  # Tight player
            return ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AKo', 'AQs']
        else:  # Standard player
            return ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', 'AKs', 'AKo', 'AQs', 'AQo', 
                   'AJs', 'KQs', 'KJs']
    
    def _get_bankroll_recommendation(self, game_state: GameState, 
                                   equity: float, bankroll: float) -> str:
        """Get bankroll management recommendation."""
        
        stake_size = game_state.blinds[1]  # Use big blind as stake reference
        buy_in = stake_size * 100  # Typical 100BB buy-in
        
        bankroll_ratio = bankroll / buy_in
        
        if bankroll_ratio < 20:
            return "DANGER: Insufficient bankroll for this stake level"
        elif bankroll_ratio < 40:
            return "CAUTION: Playing above recommended bankroll level"
        elif bankroll_ratio < 100:
            return "ACCEPTABLE: Adequate bankroll for this stake"
        else:
            return "SAFE: Strong bankroll for this stake level"
    
    def _assess_risk(self, game_state: GameState, hand_equity: HandEquity,
                    opponent_profile: OpponentProfile) -> str:
        """Assess overall risk of the situation."""
        
        risk_factors = []
        risk_score = 0
        
        # Equity-based risk
        if hand_equity.adjusted_equity < 0.3:
            risk_factors.append("Low hand equity")
            risk_score += 2
        
        # Position-based risk
        if game_state.position in [Position.EARLY, Position.SMALL_BLIND]:
            risk_factors.append("Poor position")
            risk_score += 1
        
        # Stack size risk
        stack_bb = game_state.stack_size / game_state.blinds[1]
        if stack_bb < 20:
            risk_factors.append("Short stack")
            risk_score += 2
        elif stack_bb > 200:
            risk_factors.append("Deep stack complexity")
            risk_score += 1
        
        # Opponent aggression risk
        if opponent_profile.aggression > 0.7:
            risk_factors.append("Highly aggressive opponent")
            risk_score += 1
        
        # Tournament-specific risks
        if game_state.game_type == GameType.TOURNAMENT:
            if game_state.players_left <= game_state.paid_spots + 5:
                risk_factors.append("Bubble situation")
                risk_score += 2
        
        # Determine overall risk level
        if risk_score >= 5:
            risk_level = "HIGH RISK"
        elif risk_score >= 3:
            risk_level = "MODERATE RISK"
        elif risk_score >= 1:
            risk_level = "LOW RISK"
        else:
            risk_level = "MINIMAL RISK"
        
        if risk_factors:
            return f"{risk_level}: {', '.join(risk_factors)}"
        else:
            return risk_level
    
    def _create_detailed_breakdown(self, game_state: GameState,
                                 hand_equity: HandEquity,
                                 opponent_profile: OpponentProfile) -> Dict[str, Any]:
        """Create detailed analysis breakdown."""
        
        return {
            'position_analysis': {
                'position': game_state.position.value,
                'position_advantage': hand_equity.position_adjustment,
                'recommended_range': self._estimate_our_range(game_state)
            },
            'equity_breakdown': {
                'raw_equity': hand_equity.raw_equity,
                'position_adjusted': hand_equity.adjusted_equity,
                'showdown_value': hand_equity.showdown_value,
                'bluff_value': hand_equity.bluff_value
            },
            'opponent_analysis': {
                'estimated_range': self._estimate_opponent_range(game_state, opponent_profile),
                'playing_style': self._classify_playing_style(opponent_profile),
                'exploitable_tendencies': self._identify_exploitable_tendencies(opponent_profile)
            },
            'board_analysis': {
                'texture': self._analyze_board_texture(game_state.community_cards),
                'draw_potential': self._analyze_draw_potential(game_state.community_cards),
                'future_runouts': self._analyze_future_runouts(game_state.community_cards)
            },
            'stack_analysis': {
                'effective_stack_bb': game_state.stack_size / game_state.blinds[1],
                'spr': game_state.stack_size / game_state.pot_size if game_state.pot_size > 0 else 0,
                'commitment_threshold': game_state.stack_size * 0.3
            }
        }
    
    def _classify_playing_style(self, opponent_profile: OpponentProfile) -> str:
        """Classify opponent's playing style."""
        if opponent_profile.vpip > 0.3 and opponent_profile.aggression > 0.6:
            return "Loose-Aggressive (LAG)"
        elif opponent_profile.vpip > 0.3 and opponent_profile.aggression < 0.4:
            return "Loose-Passive (Calling Station)"
        elif opponent_profile.vpip < 0.2 and opponent_profile.aggression > 0.6:
            return "Tight-Aggressive (TAG)"
        elif opponent_profile.vpip < 0.2 and opponent_profile.aggression < 0.4:
            return "Tight-Passive (Rock)"
        else:
            return "Balanced/Unknown"
    
    def _identify_exploitable_tendencies(self, opponent_profile: OpponentProfile) -> List[str]:
        """Identify exploitable tendencies in opponent's play."""
        tendencies = []
        
        if opponent_profile.fold_to_cbet > 0.7:
            tendencies.append("Folds too much to continuation bets")
        
        if opponent_profile.fold_to_3bet > 0.8:
            tendencies.append("Folds too much to 3-bets")
        
        if opponent_profile.vpip > 0.35:
            tendencies.append("Plays too many hands preflop")
        
        if opponent_profile.aggression < 0.3:
            tendencies.append("Too passive - rarely bets for value")
        
        if opponent_profile.steal_attempt > 0.5:
            tendencies.append("Steals too frequently from late position")
        
        return tendencies
    
    def _analyze_draw_potential(self, community_cards: List[str]) -> Dict[str, bool]:
        """Analyze draw potential on the board."""
        if len(community_cards) < 3:
            return {'flush_draw': False, 'straight_draw': False, 'pair_draw': True}
        
        # Extract suits and ranks
        suits = [card[-1] for card in community_cards]
        ranks = [card[:-1] for card in community_cards]
        
        # Check for flush draws
        suit_counts = Counter(suits)
        flush_draw = max(suit_counts.values()) >= 3
        
        # Check for straight draws (simplified)
        rank_values = {'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10}
        for i, rank in enumerate(['9', '8', '7', '6', '5', '4', '3', '2']):
            rank_values[rank] = 9 - i
        
        numeric_ranks = sorted([rank_values.get(rank, 0) for rank in ranks])
        straight_draw = False
        
        for i in range(len(numeric_ranks) - 1):
            if numeric_ranks[i+1] - numeric_ranks[i] <= 2:
                straight_draw = True
                break
        
        # Check for pair potential
        rank_counts = Counter(ranks)
        pair_draw = len(community_cards) < 5 or max(rank_counts.values()) == 1
        
        return {
            'flush_draw': flush_draw,
            'straight_draw': straight_draw,
            'pair_draw': pair_draw
        }
    
    def _analyze_future_runouts(self, community_cards: List[str]) -> Dict[str, float]:
        """Analyze potential future runouts."""
        cards_to_come = 5 - len(community_cards)
        
        if cards_to_come <= 0:
            return {'improvement_probability': 0.0, 'danger_cards': 0.0}
        
        # Simplified analysis
        total_unknown_cards = 52 - len(community_cards) - 2  # Assume we know our hole cards
        
        # Estimate improvement probability (very simplified)
        improvement_prob = min(0.5, cards_to_come * 0.15)
        
        # Estimate danger card probability
        danger_prob = min(0.3, cards_to_come * 0.1)
        
        return {
            'improvement_probability': improvement_prob,
            'danger_cards': danger_prob,
            'cards_to_come': cards_to_come
        }

# Factory function for easy instantiation
def create_advanced_engine() -> AdvancedPokerEngine:
    """Create and return an advanced poker engine instance."""
    return AdvancedPokerEngine()