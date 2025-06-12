from typing import List, Tuple
import random
from treys import Card, Deck, Evaluator


evaluator = Evaluator()


def _parse_card(card: str) -> int:
    """Parse a card like 'Ah' into treys integer."""
    return Card.new(card)


def parse_cards(cards: List[str]) -> List[int]:
    return [_parse_card(c) for c in cards]


def evaluate_best_hand(hole_cards: List[str], community_cards: List[str]) -> Tuple[str, int]:
    """Return human readable hand type and score."""
    hole = parse_cards(hole_cards)
    board = parse_cards(community_cards)
    score = evaluator.evaluate(board, hole)
    hand_type = evaluator.class_to_string(evaluator.get_rank_class(score))
    return hand_type, score


def estimate_win_probability(hole_cards: List[str], community_cards: List[str], *,
                             num_opponents: int = 1, trials: int = 1000) -> Tuple[float, float, float]:
    """Monte Carlo simulation of win/tie/loss probabilities."""
    hole = parse_cards(hole_cards)
    board = parse_cards(community_cards)
    known_cards = set(hole_cards + community_cards)

    wins = ties = losses = 0

    for _ in range(trials):
        deck = Deck()
        # remove known cards from deck
        for c in known_cards:
            deck.cards.remove(Card.new(c))

        # deal opponent hands
        opp_hands = []
        for _ in range(num_opponents):
            opp_hands.append([deck.draw(1)[0], deck.draw(1)[0]])
        # deal remaining community
        needed = 5 - len(board)
        community_draw = [deck.draw(1)[0] for _ in range(needed)]
        full_board = board + community_draw

        player_score = evaluator.evaluate(full_board, hole)
        best_opp = min(evaluator.evaluate(full_board, hand) for hand in opp_hands)

        if player_score < best_opp:
            wins += 1
        elif player_score == best_opp:
            ties += 1
        else:
            losses += 1

    total = float(trials)
    return wins / total, ties / total, losses / total
