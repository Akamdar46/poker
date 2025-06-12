from flask import Flask, request, jsonify
from .engine import evaluate_best_hand, estimate_win_probability
from .advanced_engine import (
    create_advanced_engine, GameState, OpponentProfile, 
    Position, GameType
)

app = Flask(__name__)

# Create advanced engine instance
advanced_engine = create_advanced_engine()

@app.route('/analyze', methods=['POST'])
def analyze():
    """Basic analysis endpoint (backward compatibility)."""
    data = request.get_json(force=True)
    hole = data.get('hole', [])
    community = data.get('community', [])
    opponents = int(data.get('opponents', 1))
    trials = int(data.get('trials', 1000))

    hand_type, _ = evaluate_best_hand(hole, community)
    win, tie, loss = estimate_win_probability(hole, community,
                                              num_opponents=opponents,
                                              trials=trials)
    return jsonify({
        'hand_type': hand_type,
        'win_prob': win,
        'tie_prob': tie,
        'loss_prob': loss
    })

@app.route('/analyze/advanced', methods=['POST'])
def analyze_advanced():
    """Advanced comprehensive analysis endpoint."""
    data = request.get_json(force=True)
    
    # Extract game state information
    hole_cards = data.get('hole_cards', [])
    community_cards = data.get('community_cards', [])
    pot_size = float(data.get('pot_size', 100))
    stack_size = float(data.get('stack_size', 2000))
    position = data.get('position', 'middle')
    num_opponents = int(data.get('num_opponents', 1))
    game_type = data.get('game_type', 'cash')
    small_blind = float(data.get('small_blind', 5))
    big_blind = float(data.get('big_blind', 10))
    antes = float(data.get('antes', 0))
    bankroll = float(data.get('bankroll', 10000))
    
    # Extract opponent profile (optional)
    opponent_data = data.get('opponent_profile', {})
    opponent_profile = OpponentProfile(
        vpip=opponent_data.get('vpip', 0.25),
        pfr=opponent_data.get('pfr', 0.18),
        aggression=opponent_data.get('aggression', 0.5),
        fold_to_cbet=opponent_data.get('fold_to_cbet', 0.6),
        fold_to_3bet=opponent_data.get('fold_to_3bet', 0.7),
        steal_attempt=opponent_data.get('steal_attempt', 0.3),
        fold_to_steal=opponent_data.get('fold_to_steal', 0.8)
    )
    
    # Create game state
    try:
        position_enum = Position(position.lower())
    except ValueError:
        position_enum = Position.MIDDLE
    
    try:
        game_type_enum = GameType(game_type.lower())
    except ValueError:
        game_type_enum = GameType.CASH
    
    game_state = GameState(
        hole_cards=hole_cards,
        community_cards=community_cards,
        pot_size=pot_size,
        stack_size=stack_size,
        position=position_enum,
        num_opponents=num_opponents,
        game_type=game_type_enum,
        blinds=(small_blind, big_blind),
        antes=antes,
        players_left=data.get('players_left', 9),
        paid_spots=data.get('paid_spots', 0),
        prize_pool=data.get('prize_pool', [])
    )
    
    # Perform comprehensive analysis
    try:
        analysis = advanced_engine.analyze_comprehensive(
            game_state, opponent_profile, bankroll
        )
        
        # Convert to JSON-serializable format
        result = {
            'hand_strength': analysis.hand_strength,
            'equity': {
                'raw': round(analysis.raw_equity, 4),
                'adjusted': round(analysis.adjusted_equity, 4)
            },
            'odds': {
                'pot_odds': round(analysis.pot_odds, 2),
                'implied_odds': round(analysis.implied_odds, 2),
                'reverse_implied_odds': round(analysis.reverse_implied_odds, 4),
                'fold_equity': round(analysis.fold_equity, 2)
            },
            'expected_value': round(analysis.expected_value, 2),
            'recommendation': {
                'optimal_action': analysis.optimal_action,
                'bet_sizing': round(analysis.bet_sizing, 2),
                'bluff_frequency': round(analysis.bluff_frequency, 4)
            },
            'gto_strategy': {
                action: round(prob, 4) 
                for action, prob in analysis.gto_strategy.items()
            },
            'bankroll_management': analysis.bankroll_recommendation,
            'risk_assessment': analysis.risk_assessment,
            'detailed_analysis': analysis.detailed_breakdown
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': f'Analysis failed: {str(e)}',
            'fallback': 'Using basic analysis'
        }), 500

@app.route('/analyze/equity', methods=['POST'])
def analyze_equity():
    """Detailed equity analysis endpoint."""
    data = request.get_json(force=True)
    
    hole_cards = data.get('hole_cards', [])
    community_cards = data.get('community_cards', [])
    opponent_ranges = data.get('opponent_ranges', [])
    position = data.get('position', 'middle')
    stack_size = float(data.get('stack_size', 2000))
    pot_size = float(data.get('pot_size', 100))
    
    try:
        # Calculate raw equity
        from .engine import estimate_win_probability
        win_prob, tie_prob, loss_prob = estimate_win_probability(
            hole_cards, community_cards, 
            num_opponents=len(opponent_ranges) if opponent_ranges else 1,
            trials=5000
        )
        
        raw_equity = win_prob + (tie_prob * 0.5)
        
        # Calculate adjusted equity
        equity_calculator = advanced_engine.equity_calculator
        hand_equity = equity_calculator.calculate_adjusted_equity(
            raw_equity, position, stack_size, pot_size, {}
        )
        
        return jsonify({
            'raw_equity': round(raw_equity, 4),
            'adjusted_equity': round(hand_equity.adjusted_equity, 4),
            'showdown_value': round(hand_equity.showdown_value, 4),
            'bluff_value': round(hand_equity.bluff_value, 4),
            'position_adjustment': round(hand_equity.position_adjustment, 4),
            'win_probability': round(win_prob, 4),
            'tie_probability': round(tie_prob, 4),
            'loss_probability': round(loss_prob, 4)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze/gto', methods=['POST'])
def analyze_gto():
    """Game Theory Optimal strategy analysis."""
    data = request.get_json(force=True)
    
    position = data.get('position', 'middle')
    stack_depth = float(data.get('stack_depth', 100))
    pot_size = float(data.get('pot_size', 100))
    our_range = data.get('our_range', ['AA', 'KK', 'QQ'])
    opponent_range = data.get('opponent_range', ['AA', 'KK', 'QQ', 'AKs'])
    
    try:
        gto_calculator = advanced_engine.gto_calculator
        strategy = gto_calculator.calculate_gto_strategy(
            position, stack_depth, pot_size, our_range, opponent_range
        )
        
        return jsonify({
            'gto_strategy': {
                action: round(prob, 4) 
                for action, prob in strategy.items()
            },
            'position': position,
            'stack_depth': stack_depth,
            'range_analysis': {
                'our_range_size': len(our_range),
                'opponent_range_size': len(opponent_range)
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze/bankroll', methods=['POST'])
def analyze_bankroll():
    """Bankroll management analysis."""
    data = request.get_json(force=True)
    
    bankroll = float(data.get('bankroll', 10000))
    win_rate = float(data.get('win_rate', 0.05))
    standard_deviation = float(data.get('standard_deviation', 1.0))
    stake_level = float(data.get('stake_level', 100))
    risk_tolerance = float(data.get('risk_tolerance', 0.01))
    
    try:
        bankroll_manager = advanced_engine.bankroll_manager
        
        # Calculate Kelly Criterion
        kelly_fraction = bankroll_manager.calculate_kelly_criterion(
            0.55, win_rate * stake_level, stake_level
        )
        
        # Calculate Risk of Ruin
        risk_of_ruin = bankroll_manager.calculate_risk_of_ruin(
            bankroll, win_rate, standard_deviation, stake_level
        )
        
        # Calculate optimal stake
        optimal_stake = bankroll_manager.calculate_optimal_stake(
            bankroll, win_rate, standard_deviation, risk_tolerance
        )
        
        return jsonify({
            'kelly_fraction': round(kelly_fraction, 4),
            'risk_of_ruin': round(risk_of_ruin, 4),
            'optimal_stake': round(optimal_stake, 2),
            'bankroll_ratio': round(bankroll / stake_level, 1),
            'recommendation': (
                'SAFE' if bankroll / stake_level > 100 else
                'CAUTION' if bankroll / stake_level > 40 else
                'DANGER'
            )
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)