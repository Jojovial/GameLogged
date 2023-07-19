from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.ultis import generate_error_response, generate_success_response
from app.models.game import Game

game_routes = Blueprint('games', __name__, url_prefix='/games')

@game_routes.route('/all', methods=['GET'])
@login_required
def get_all_games():
    games = Game.query.all()
    games_data = [{
        'id': game.id,
        'name': game.name,
        'system': game.system.value,
        'region': game.region.value
    } for game in games]
    return jsonify({'games': games_data})
