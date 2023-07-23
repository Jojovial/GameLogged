from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.entry import Entry
from app.models.db import db
from app.models.review import Review
from app.models.game import Game
from app.forms.forms import EntryForm, GameForm, ReviewForm
from app.ultis import generate_error_response, generate_success_response
from sqlalchemy import asc

game_routes = Blueprint('games', __name__, url_prefix='/games')

# Get a game by ID
@game_routes.route('/<int:game_id>', methods=['GET'])
@login_required
def get_game_by_id(game_id):
    game = Game.query.get(game_id)

    if not game:
        return generate_error_response('Game not found.', 404)

    # You can add additional checks here to see if the current user has access to this game
    # For example, you can check if the game is associated with any entry owned by the current user

    game_data = {
        'id': game.id,
        'name': game.name,
        'system': game.system,
        'region': game.region
    }

    return generate_success_response({'game': game_data})

@game_routes.route('/all', methods=['GET'])
@login_required
def get_all_games():
    games = Game.query.all()
    games_data = [{
        'id': game.id,
        'name': game.name,
        'system': game.system,
        'region': game.region
    } for game in games]
    return jsonify({'games': games_data})

# Create new game
@game_routes.route('', methods=['POST'])
@login_required
def create_game():
    data = request.json
    print("Received data:", data)

    game_form = GameForm(data=data)
    game_form['csrf_token'].data = request.cookies['csrf_token']

    if game_form.validate():
        try:

            # Validate the incoming data here and create a new game entry.
            new_game = Game(
                name=data['name'],
                system=data['system'],
                region=data['region']
            )
            db.session.add(new_game)
            db.session.commit()
            print("New game entry created successfully:", new_game)

            return generate_success_response({'message': 'Game created successfully.', 'game': new_game.to_dict()})

        except KeyError as e:
            return generate_error_response(f'Invalid enum value: {str(e)}', 400)

        except Exception as e:
            db.session.rollback()  # Roll back the transaction in case of an error
            print("Error creating the game:", e)
            return generate_error_response(f'Error creating the game: {str(e)}', 500)

    else:
        return generate_error_response('Invalid form data.', 400)


# Update a game within an entry
@game_routes.route('/<int:game_id>', methods=['PUT'])
@login_required
def update_game(entry_id, game_id):
    game = Game.query.get(game_id)

    if not game:
        return generate_error_response('Game not found.', 404)

    if game.entry_id != entry_id:
        return generate_error_response('Unauthorized to update this game.', 403)

    data = request.get_json()
    game_form = GameForm(data=data)
    game_form['csrf_token'].data = request.cookies['csrf_token']

    if game_form.validate():
        # Update the game fields based on the form data
        game.name = game_form.name.data
        game.system = game_form.system.data
        game.region = game_form.region.data

        db.session.commit()

        return generate_success_response('Game updated successfully!')
    else:
        return generate_error_response('Invalid form data.', 400)


#Delete a game within an entry
@game_routes.route('/<int:game_id>', methods=['DELETE'])
@login_required
def delete_game(entry_id, game_id):
    entry = Entry.query.get(entry_id)

    if not entry:
        return generate_error_response('Entry not found.', 404)

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to delete this game.', 403)

    game = Game.query.get(game_id)

    if not game or game.id != entry.game_id:
        return generate_error_response('Game not found.', 404)

    db.session.delete(game)
    db.session.commit()

    return generate_success_response({'message': 'Game deleted successfully.'})
