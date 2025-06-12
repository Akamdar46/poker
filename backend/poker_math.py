"""
Advanced poker mathematics and probability calculations.
"""
import math
import itertools
from typing import List, Tuple, Dict, Optional
from collections import Counter
from dataclasses import dataclass
from enum import Enum

class HandStrength(Enum):
    HIGH_CARD = 1
    PAIR = 2
    TWO_PAIR = 3
    THREE_OF_A_KIND = 4
    STRAIGHT = 5
    FLUSH = 6
    FULL_HOUSE = 7
    FOUR_OF_A_KIND = 8
    STRAIGHT_FLUSH = 9
    ROYAL_FLUSH = 10

@dataclass
class PokerOdds:
    """Container for various poker odds and probabilities."""
    win_probability: float
    tie_probability: float
    loss_probability: float
    pot_odds: float
    implied_odds: float
    fold_equity: float
    expected_value: float

@dataclass
class HandEquity:
    """Detailed hand equity analysis."""
    raw_equity: float
    adjusted_equity: float
    showdown_value: float
    bluff_value: float
    position_adjustment: float

class PokerMath:
    """Advanced poker mathematics calculations."""
    
    # Pre-computed hand rankings for efficiency
    HAND_RANKINGS = {
        'royal_flush': 10,
        'straight_flush': 9,
        'four_of_a_kind': 8,
        'full_house': 7,
        'flush': 6,
        'straight': 5,
        'three_of_a_kind': 4,
        'two_pair': 3,
        'pair': 2,
        'high_card': 1
    }
    
    # Preflop hand strength matrix (simplified)
    PREFLOP_STRENGTH = {
        'AA': 0.85, 'KK': 0.82, 'QQ': 0.80, 'JJ': 0.77, 'TT': 0.75,
        'AKs': 0.67, 'AQs': 0.66, 'AJs': 0.65, 'ATs': 0.64, 'A9s': 0.62,
        'AKo': 0.65, 'AQo': 0.64, 'AJo': 0.63, 'ATo': 0.62, 'A9o': 0.60,
        'KQs': 0.63, 'KJs': 0.62, 'KTs': 0.61, 'K9s': 0.59, 'K8s': 0.57,
        'KQo': 0.61, 'KJo': 0.60, 'KTo': 0.59, 'K9o': 0.57, 'K8o': 0.55,
        'QJs': 0.60, 'QTs': 0.59, 'Q9s': 0.57, 'Q8s': 0.55, 'Q7s': 0.53,
        'QJo': 0.58, 'QTo': 0.57, 'Q9o': 0.55, 'Q8o': 0.53, 'Q7o': 0.51,
        'JTs': 0.57, 'J9s': 0.55, 'J8s': 0.53, 'J7s': 0.51, 'J6s': 0.49,
        'JTo': 0.55, 'J9o': 0.53, 'J8o': 0.51, 'J7o': 0.49, 'J6o': 0.47,
        '99': 0.72, '88': 0.69, '77': 0.66, '66': 0.63, '55': 0.60,
        '44': 0.57, '33': 0.54, '22': 0.51
    }
    
    @staticmethod
    def calculate_pot_odds(pot_size: float, bet_to_call: float) -> float:
        """Calculate pot odds as a ratio."""
        if bet_to_call <= 0:
            return float('inf')
        return pot_size / bet_to_call
    
    @staticmethod
    def calculate_implied_odds(pot_size: float, bet_to_call: float, 
                             potential_winnings: float, win_probability: float) -> float:
        """Calculate implied odds considering future betting rounds."""
        if bet_to_call <= 0:
            return float('inf')
        
        total_potential = pot_size + potential_winnings
        return (total_potential * win_probability) / bet_to_call
    
    @staticmethod
    def calculate_fold_equity(opponent_fold_probability: float, pot_size: float) -> float:
        """Calculate fold equity - the value gained when opponent folds."""
        return opponent_fold_probability * pot_size
    
    @staticmethod
    def calculate_expected_value(win_prob: float, tie_prob: float, 
                               pot_size: float, bet_amount: float) -> float:
        """Calculate expected value of a betting decision."""
        win_ev = win_prob * pot_size
        tie_ev = tie_prob * (pot_size / 2)
        loss_ev = (1 - win_prob - tie_prob) * (-bet_amount)
        return win_ev + tie_ev + loss_ev
    
    @staticmethod
    def calculate_minimum_defense_frequency(bet_size: float, pot_size: float) -> float:
        """Calculate minimum defense frequency to prevent exploitation."""
        if bet_size <= 0:
            return 0.0
        return pot_size / (pot_size + bet_size)
    
    @staticmethod
    def calculate_optimal_bet_size(pot_size: float, hand_strength: float, 
                                 opponent_calling_range: float) -> float:
        """Calculate optimal bet size based on hand strength and opponent tendencies."""
        # Simplified model - in practice this would be much more complex
        base_bet = pot_size * 0.75
        strength_multiplier = hand_strength * 1.5
        calling_adjustment = 1 - (opponent_calling_range * 0.3)
        
        return base_bet * strength_multiplier * calling_adjustment
    
    @staticmethod
    def calculate_bluff_frequency(pot_size: float, bet_size: float) -> float:
        """Calculate optimal bluffing frequency."""
        if bet_size <= 0:
            return 0.0
        return pot_size / bet_size
    
    @staticmethod
    def calculate_hand_combinations(hand_type: str) -> int:
        """Calculate number of possible combinations for a hand type."""
        combinations = {
            'royal_flush': 4,
            'straight_flush': 36,
            'four_of_a_kind': 624,
            'full_house': 3744,
            'flush': 5108,
            'straight': 10200,
            'three_of_a_kind': 54912,
            'two_pair': 123552,
            'pair': 1098240,
            'high_card': 1302540
        }
        return combinations.get(hand_type, 0)
    
    @staticmethod
    def calculate_outs(hole_cards: List[str], community_cards: List[str], 
                      target_hand: str) -> int:
        """Calculate number of outs to improve to target hand."""
        # This is a simplified version - real implementation would be more complex
        known_cards = set(hole_cards + community_cards)
        remaining_cards = 52 - len(known_cards)
        
        # Simplified out counting based on target hand
        out_estimates = {
            'flush': 9,
            'straight': 8,
            'two_pair': 4,
            'three_of_a_kind': 2,
            'full_house': 7,
            'four_of_a_kind': 1
        }
        
        return out_estimates.get(target_hand, 0)
    
    @staticmethod
    def calculate_card_removal_effects(removed_cards: List[str], 
                                     target_combinations: int) -> float:
        """Calculate how removed cards affect probability of target hand."""
        # Simplified card removal calculation
        total_cards = 52
        cards_removed = len(removed_cards)
        remaining_cards = total_cards - cards_removed
        
        # Basic probability adjustment
        adjustment_factor = remaining_cards / total_cards
        return target_combinations * adjustment_factor
    
    @staticmethod
    def calculate_reverse_implied_odds(current_hand_strength: float, 
                                     board_texture: str, position: str) -> float:
        """Calculate reverse implied odds - potential losses on future streets."""
        # Simplified model
        base_rio = 0.1
        
        # Adjust based on board texture
        texture_adjustments = {
            'dry': 0.05,
            'wet': 0.15,
            'coordinated': 0.20
        }
        
        # Adjust based on position
        position_adjustments = {
            'early': 0.05,
            'middle': 0.03,
            'late': 0.01
        }
        
        texture_adj = texture_adjustments.get(board_texture, 0.1)
        position_adj = position_adjustments.get(position, 0.03)
        
        return base_rio + texture_adj + position_adj - (current_hand_strength * 0.1)

class AdvancedEquityCalculator:
    """Advanced equity calculations with multiple factors."""
    
    def __init__(self):
        self.position_adjustments = {
            'early': -0.05,
            'middle': 0.0,
            'late': 0.05,
            'button': 0.08,
            'small_blind': -0.03,
            'big_blind': -0.02
        }
    
    def calculate_adjusted_equity(self, raw_equity: float, position: str, 
                                stack_size: float, pot_size: float,
                                opponent_tendencies: Dict[str, float]) -> HandEquity:
        """Calculate equity adjusted for multiple factors."""
        
        # Position adjustment
        position_adj = self.position_adjustments.get(position, 0.0)
        
        # Stack-to-pot ratio adjustment
        spr = stack_size / pot_size if pot_size > 0 else 10
        spr_adjustment = self._calculate_spr_adjustment(spr, raw_equity)
        
        # Opponent tendency adjustments
        aggression_adj = self._calculate_aggression_adjustment(
            opponent_tendencies.get('aggression', 0.5), raw_equity
        )
        
        # Calculate final adjusted equity
        adjusted_equity = raw_equity + position_adj + spr_adjustment + aggression_adj
        adjusted_equity = max(0.0, min(1.0, adjusted_equity))
        
        # Calculate showdown and bluff values
        showdown_value = self._calculate_showdown_value(adjusted_equity)
        bluff_value = self._calculate_bluff_value(position, opponent_tendencies)
        
        return HandEquity(
            raw_equity=raw_equity,
            adjusted_equity=adjusted_equity,
            showdown_value=showdown_value,
            bluff_value=bluff_value,
            position_adjustment=position_adj
        )
    
    def _calculate_spr_adjustment(self, spr: float, equity: float) -> float:
        """Calculate stack-to-pot ratio adjustment."""
        if spr < 1:
            return 0.05 if equity > 0.7 else -0.05
        elif spr > 10:
            return -0.02 if equity < 0.3 else 0.02
        return 0.0
    
    def _calculate_aggression_adjustment(self, opponent_aggression: float, 
                                      equity: float) -> float:
        """Calculate adjustment based on opponent aggression."""
        if opponent_aggression > 0.7:  # Very aggressive opponent
            return -0.03 if equity < 0.6 else 0.02
        elif opponent_aggression < 0.3:  # Passive opponent
            return 0.02 if equity > 0.4 else -0.01
        return 0.0
    
    def _calculate_showdown_value(self, equity: float) -> float:
        """Calculate showdown value of the hand."""
        return equity * 0.8  # Simplified calculation
    
    def _calculate_bluff_value(self, position: str, 
                             opponent_tendencies: Dict[str, float]) -> float:
        """Calculate bluff value based on position and opponent."""
        base_bluff_value = 0.1
        
        if position in ['button', 'late']:
            base_bluff_value += 0.05
        
        fold_frequency = opponent_tendencies.get('fold_to_bet', 0.5)
        base_bluff_value += (fold_frequency - 0.5) * 0.2
        
        return max(0.0, min(0.5, base_bluff_value))

class RangeAnalyzer:
    """Analyze and work with poker hand ranges."""
    
    def __init__(self):
        self.all_hands = self._generate_all_hands()
    
    def _generate_all_hands(self) -> List[str]:
        """Generate all possible starting hands."""
        ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
        hands = []
        
        # Pairs
        for rank in ranks:
            hands.append(rank + rank)
        
        # Suited hands
        for i, rank1 in enumerate(ranks):
            for rank2 in ranks[i+1:]:
                hands.append(rank1 + rank2 + 's')
        
        # Offsuit hands
        for i, rank1 in enumerate(ranks):
            for rank2 in ranks[i+1:]:
                hands.append(rank1 + rank2 + 'o')
        
        return hands
    
    def parse_range(self, range_string: str) -> List[str]:
        """Parse a range string into individual hands."""
        # Simplified range parsing - real implementation would be more robust
        hands = []
        parts = range_string.split(',')
        
        for part in parts:
            part = part.strip()
            if '+' in part:
                # Handle plus notation (e.g., "77+" means 77, 88, 99, TT, JJ, QQ, KK, AA)
                base_hand = part.replace('+', '')
                hands.extend(self._expand_plus_notation(base_hand))
            elif '-' in part:
                # Handle range notation (e.g., "A2s-A9s")
                hands.extend(self._expand_range_notation(part))
            else:
                hands.append(part)
        
        return hands
    
    def _expand_plus_notation(self, base_hand: str) -> List[str]:
        """Expand plus notation into individual hands."""
        # Simplified implementation
        return [base_hand]  # Would need full implementation
    
    def _expand_range_notation(self, range_notation: str) -> List[str]:
        """Expand range notation into individual hands."""
        # Simplified implementation
        return [range_notation]  # Would need full implementation
    
    def calculate_range_equity(self, range1: List[str], range2: List[str], 
                             board: List[str] = None) -> float:
        """Calculate equity of range1 vs range2."""
        # Simplified calculation - real implementation would simulate all combinations
        total_equity = 0.0
        combinations = 0
        
        for hand1 in range1:
            for hand2 in range2:
                # Simplified equity lookup
                equity = self._lookup_hand_vs_hand_equity(hand1, hand2, board)
                total_equity += equity
                combinations += 1
        
        return total_equity / combinations if combinations > 0 else 0.0
    
    def _lookup_hand_vs_hand_equity(self, hand1: str, hand2: str, 
                                  board: List[str] = None) -> float:
        """Lookup or calculate equity between two specific hands."""
        # Simplified lookup - real implementation would use precomputed tables
        # or run simulations
        return 0.5  # Placeholder

class GameTheoryOptimal:
    """Game Theory Optimal (GTO) strategy calculations."""
    
    def __init__(self):
        self.nash_equilibrium_cache = {}
    
    def calculate_gto_strategy(self, position: str, stack_depth: float,
                             pot_size: float, hand_range: List[str],
                             opponent_range: List[str]) -> Dict[str, float]:
        """Calculate GTO strategy for given situation."""
        
        # Simplified GTO calculation
        strategy = {
            'fold': 0.0,
            'call': 0.0,
            'raise': 0.0
        }
        
        # Calculate hand strength vs opponent range
        hand_strength = self._calculate_range_strength(hand_range, opponent_range)
        
        # Adjust strategy based on position and stack depth
        if position in ['button', 'late']:
            strategy['raise'] += 0.1
        
        if stack_depth < 20:  # Short stack
            strategy['fold'] += 0.1
            strategy['raise'] += 0.1
            strategy['call'] -= 0.2
        
        # Normalize strategy
        total = sum(strategy.values())
        if total > 0:
            for action in strategy:
                strategy[action] /= total
        
        return strategy
    
    def _calculate_range_strength(self, our_range: List[str], 
                                opponent_range: List[str]) -> float:
        """Calculate relative strength of our range vs opponent's range."""
        # Simplified calculation
        our_strength = sum(PokerMath.PREFLOP_STRENGTH.get(hand, 0.3) 
                          for hand in our_range) / len(our_range)
        opp_strength = sum(PokerMath.PREFLOP_STRENGTH.get(hand, 0.3) 
                          for hand in opponent_range) / len(opponent_range)
        
        return our_strength / (our_strength + opp_strength)
    
    def calculate_nash_equilibrium(self, game_matrix: List[List[float]]) -> Tuple[List[float], List[float]]:
        """Calculate Nash equilibrium for a simplified game matrix."""
        # Simplified Nash equilibrium calculation
        # Real implementation would use linear programming or iterative methods
        
        rows = len(game_matrix)
        cols = len(game_matrix[0]) if rows > 0 else 0
        
        # Return uniform mixed strategy as placeholder
        row_strategy = [1.0 / rows] * rows
        col_strategy = [1.0 / cols] * cols
        
        return row_strategy, col_strategy

class BankrollManagement:
    """Bankroll management and risk assessment."""
    
    @staticmethod
    def calculate_kelly_criterion(win_probability: float, win_amount: float,
                                loss_amount: float) -> float:
        """Calculate optimal bet size using Kelly Criterion."""
        if loss_amount <= 0:
            return 0.0
        
        b = win_amount / loss_amount  # Odds received
        p = win_probability
        q = 1 - p
        
        kelly_fraction = (b * p - q) / b
        return max(0.0, kelly_fraction)
    
    @staticmethod
    def calculate_risk_of_ruin(bankroll: float, win_rate: float,
                             standard_deviation: float, bet_size: float) -> float:
        """Calculate risk of ruin given bankroll parameters."""
        if bet_size <= 0 or standard_deviation <= 0:
            return 0.0
        
        # Simplified risk of ruin calculation
        z = win_rate / standard_deviation
        n = bankroll / bet_size
        
        if z >= 0:
            ror = math.exp(-2 * z * n)
        else:
            ror = 1.0
        
        return min(1.0, max(0.0, ror))
    
    @staticmethod
    def calculate_optimal_stake(bankroll: float, edge: float,
                              variance: float, risk_tolerance: float = 0.01) -> float:
        """Calculate optimal stake size given bankroll and edge."""
        if variance <= 0:
            return 0.0
        
        # Using a conservative approach based on Kelly with risk adjustment
        kelly_fraction = edge / variance
        risk_adjusted_fraction = kelly_fraction * (1 - risk_tolerance)
        
        return bankroll * max(0.0, min(0.25, risk_adjusted_fraction))

class TournamentMath:
    """Tournament-specific mathematical calculations."""
    
    @staticmethod
    def calculate_icm_value(stack_size: float, total_chips: float,
                          prize_pool: List[float], players_left: int) -> float:
        """Calculate Independent Chip Model (ICM) value."""
        if total_chips <= 0 or players_left <= 0:
            return 0.0
        
        chip_percentage = stack_size / total_chips
        
        # Simplified ICM calculation
        # Real implementation would use complex probability calculations
        if players_left <= len(prize_pool):
            weighted_prize = sum(prize_pool[:players_left]) / players_left
            return chip_percentage * weighted_prize
        
        return 0.0
    
    @staticmethod
    def calculate_bubble_factor(players_left: int, paid_spots: int,
                              stack_size: float, average_stack: float) -> float:
        """Calculate bubble factor for tournament play."""
        if players_left <= paid_spots:
            return 1.0
        
        spots_from_money = players_left - paid_spots
        stack_ratio = stack_size / average_stack if average_stack > 0 else 1.0
        
        # Simplified bubble factor calculation
        base_factor = 1.0 + (spots_from_money * 0.1)
        stack_adjustment = 1.0 / (1.0 + stack_ratio)
        
        return base_factor * stack_adjustment
    
    @staticmethod
    def calculate_push_fold_range(stack_size: float, blinds: float,
                                antes: float, players_left: int) -> float:
        """Calculate optimal push/fold range in tournaments."""
        effective_stack = stack_size / (blinds + antes) if (blinds + antes) > 0 else 20
        
        # Simplified push/fold calculation based on effective stack size
        if effective_stack <= 8:
            return 0.4  # Push with top 40% of hands
        elif effective_stack <= 12:
            return 0.25  # Push with top 25% of hands
        elif effective_stack <= 20:
            return 0.15  # Push with top 15% of hands
        else:
            return 0.05  # Very tight range