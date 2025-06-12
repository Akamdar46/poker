# Intelligent Texas Hold'em Poker Assistant

This repository contains a minimal prototype for a poker assistant. It features
basic hand evaluation and Monte Carlo win probability estimation.

## Requirements

```
pip install flask treys
```

## Running the API

```
python -m backend.app
```

POST JSON to `/analyze` with fields `hole` (list of two cards), `community`
(list of 0-5 cards), `opponents` (number of opponents) and `trials` (simulation
trials). Card notation uses standard two character values like `Ah` for Ace of
hearts, `Td` for Ten of diamonds.

Example request using `curl`:

```
curl -X POST http://localhost:5000/analyze \
     -H "Content-Type: application/json" \
     -d '{"hole": ["Ah","Ad"], "community": ["Ac","2d","9s"], "opponents": 2, "trials": 5000}'
```

The response will contain the hand type and estimated win/tie/loss
probabilities.
