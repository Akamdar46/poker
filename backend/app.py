from flask import Flask, request, jsonify
from .engine import evaluate_best_hand, estimate_win_probability

app = Flask(__name__)


@app.route('/analyze', methods=['POST'])
def analyze():
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


if __name__ == '__main__':
    app.run(debug=True)
