# Intelligent Texas Hold'em Poker Assistant

This repository contains a comprehensive poker assistant with advanced mathematical analysis, Game Theory Optimal (GTO) strategy calculations, and sophisticated equity analysis.

## Features

### Basic Analysis
- Hand evaluation and ranking
- Monte Carlo win probability estimation
- Basic pot odds calculations

### Advanced Analysis
- **Equity Calculations**: Raw and position-adjusted equity with showdown/bluff value
- **Comprehensive Odds**: Pot odds, implied odds, reverse implied odds, fold equity
- **Game Theory Optimal**: GTO strategy recommendations and Nash equilibrium calculations
- **Bankroll Management**: Kelly Criterion, Risk of Ruin, optimal stake sizing
- **Tournament Math**: ICM calculations, bubble factors, push/fold ranges
- **Range Analysis**: Hand range parsing and equity vs range calculations
- **Opponent Modeling**: Playing style classification and exploitable tendency identification

## Requirements

```
pip install flask treys numpy scipy
```

## API Endpoints

### Basic Analysis
```bash
curl -X POST http://localhost:5000/analyze \
     -H "Content-Type: application/json" \
     -d '{"hole": ["Ah","Ad"], "community": ["Ac","2d","9s"], "opponents": 2, "trials": 5000}'
```

### Advanced Comprehensive Analysis
```bash
curl -X POST http://localhost:5000/analyze/advanced \
     -H "Content-Type: application/json" \
     -d '{
       "hole_cards": ["Ah","Ad"],
       "community_cards": ["Ac","2d","9s"],
       "pot_size": 150,
       "stack_size": 2000,
       "position": "button",
       "num_opponents": 2,
       "game_type": "cash",
       "small_blind": 5,
       "big_blind": 10,
       "bankroll": 10000,
       "opponent_profile": {
         "vpip": 0.28,
         "pfr": 0.20,
         "aggression": 0.65,
         "fold_to_cbet": 0.55
       }
     }'
```

### Equity Analysis
```bash
curl -X POST http://localhost:5000/analyze/equity \
     -H "Content-Type: application/json" \
     -d '{
       "hole_cards": ["Ah","Kh"],
       "community_cards": ["Qh","Jh","2c"],
       "position": "button",
       "stack_size": 2000,
       "pot_size": 100
     }'
```

### GTO Strategy Analysis
```bash
curl -X POST http://localhost:5000/analyze/gto \
     -H "Content-Type: application/json" \
     -d '{
       "position": "button",
       "stack_depth": 100,
       "pot_size": 100,
       "our_range": ["AA", "KK", "QQ", "AKs", "AKo"],
       "opponent_range": ["AA", "KK", "QQ", "JJ", "AKs", "AQs"]
     }'
```

### Bankroll Management
```bash
curl -X POST http://localhost:5000/analyze/bankroll \
     -H "Content-Type: application/json" \
     -d '{
       "bankroll": 10000,
       "win_rate": 0.05,
       "standard_deviation": 1.2,
       "stake_level": 100,
       "risk_tolerance": 0.01
     }'
```

## Mathematical Models

### Equity Calculations
- **Raw Equity**: Monte Carlo simulation with 10,000+ trials
- **Adjusted Equity**: Position, stack depth, and opponent tendency adjustments
- **Showdown Value**: Expected value when hand goes to showdown
- **Bluff Value**: Expected value from fold equity

### Game Theory Optimal
- **Nash Equilibrium**: Balanced strategy calculations
- **Optimal Bet Sizing**: Mathematically optimal bet sizes
- **Bluff Frequencies**: Optimal bluffing ratios
- **Defense Frequencies**: Minimum defense to prevent exploitation

### Bankroll Management
- **Kelly Criterion**: Optimal bet sizing for bankroll growth
- **Risk of Ruin**: Probability of losing entire bankroll
- **Optimal Stakes**: Recommended stake levels based on bankroll and edge

### Tournament Mathematics
- **ICM (Independent Chip Model)**: Tournament equity calculations
- **Bubble Factors**: Risk adjustments near money bubble
- **Push/Fold Ranges**: Optimal short-stack strategy

## Advanced Features

### Range Analysis
- Parse standard range notation (e.g., "77+", "A2s-A9s", "KQo+")
- Calculate equity vs opponent ranges
- Range vs range equity calculations

### Opponent Modeling
- **Playing Style Classification**: TAG, LAG, Calling Station, Rock
- **Exploitable Tendencies**: Identify and exploit opponent weaknesses
- **Adaptive Strategy**: Adjust recommendations based on opponent profile

### Board Texture Analysis
- **Texture Classification**: Dry, wet, coordinated boards
- **Draw Analysis**: Flush draws, straight draws, pair potential
- **Future Runouts**: Probability analysis for remaining cards

### Position and Stack Considerations
- **Position Adjustments**: Early, middle, late position factors
- **Stack-to-Pot Ratio**: SPR-based strategy adjustments
- **Effective Stack**: Calculations based on shortest stack

## Response Format

The advanced analysis returns comprehensive data including:

```json
{
  "hand_strength": "Three of a Kind",
  "equity": {
    "raw": 0.8542,
    "adjusted": 0.8721
  },
  "odds": {
    "pot_odds": 3.5,
    "implied_odds": 5.2,
    "reverse_implied_odds": 0.0234,
    "fold_equity": 45.5
  },
  "expected_value": 127.34,
  "recommendation": {
    "optimal_action": "raise",
    "bet_sizing": 112.5,
    "bluff_frequency": 0.1333
  },
  "gto_strategy": {
    "fold": 0.0,
    "call": 0.2,
    "raise": 0.8
  },
  "bankroll_management": "SAFE: Strong bankroll for this stake level",
  "risk_assessment": "LOW RISK: Strong hand, good position",
  "detailed_analysis": {
    "position_analysis": {...},
    "equity_breakdown": {...},
    "opponent_analysis": {...},
    "board_analysis": {...},
    "stack_analysis": {...}
  }
}
```

## Running the API

```bash
python -m backend.app
```

The API will be available at `http://localhost:5000`

## Mathematical Accuracy

All calculations are based on established poker theory and mathematical models:
- Monte Carlo simulations with configurable trial counts
- Proven bankroll management formulas
- Game theory optimal strategies
- Industry-standard equity calculations

The engine provides both simplified quick calculations and detailed analysis suitable for serious poker study and play.