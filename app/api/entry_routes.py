from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.entry import Entry
from app.models.db import db
from app.models.review import Review
from app.models.game import Game
from app.forms.forms import EntryForm, GameForm, ReviewForm
from app.ultis import generate_error_response, generate_success_response
from sqlalchemy import asc



entry_routes = Blueprint('entries', __name__, url_prefix='/entries')

#GET details of specific entry
@entry_routes.route('/<int:entry_id>', methods=["GET"])
@login_required
def get_entry_details(entry_id):
    entry = Entry.query.get(entry_id)

    if not entry:
        return generate_error_response('Entry not found.', 404)

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to access this board.', 403)

    entry_data = {
        'id': entry.id,
        'game_id': entry.game_id,
        'progress': entry.progress.value,
        'progress_note': entry.progress_note,
        'is_now_playing': entry.is_now_playing,
        'wishlist': entry.wishlist
    }

    game = Game.query.get(entry.game_id)
    if game:
        entry_data['game'] = {
            'id': game.id,
            'name': game.name,
            'system': game.system.value,
            'region': game.region.value
        }

    review = Review.query.filter_by(entry_id=entry.id).first()
    if review:
        entry_data['review'] = {
            'id': review.id,
            'rating': review.rating,
            'review_text': review.review_text
        }

    return generate_success_response({'entry': entry_data})


#GET all games by current user
@entry_routes.route('/games/all', methods=['GET'])
@login_required
def get_user_games():
    entries = Entry.query.filter_by(user_id=current_user.id).all()
    game_ids = [entry.game_id for entry in entries]
    games = Game.query.filter(Game.id.in_(game_ids)).all()

    games_data = [{
        'id': game.id,
        'name': game.name,
        'system': game.system,
        'region': game.region
    } for game in games]

    return generate_success_response({'games': games_data})

#GET all reviews by current user
@entry_routes.route('/reviews/all', methods=['GET'])
@login_required
def get_user_reviews():
    entries = Entry.query.filter_by(user_id=current_user.id).all()
    entry_ids = [entry.id for entry in entries]
    reviews = Review.query.filter(Review.entry_id.in_(entry_ids)).all()

    reviews_data = [{
        'id': review.id,
        'entry_id': review.entry_id,
        'game_id': review.game_id,
        'rating': review.rating,
        'review_text': review.review_text
    } for review in reviews]

    return generate_success_response({'reviews': reviews_data})

#GET all entries by current user
@entry_routes.route('/all', methods=['GET'])
@login_required
def get_entries():
    entries = Entry.query.filter_by(user_id=current_user.id).order_by(asc(Entry.id)).all()
    entries_data = [{'id': entry.id,
                     'game_id': entry.game_id,
                     'progress': entry.progress,
                     'progress_note': entry.progress_note,
                     'is_now_playing': entry.is_now_playing,
                     'wishlist': entry.wishlist}
                     for entry in entries]
    return generate_success_response({'entries': entries_data})

# Create new entry
@entry_routes.route('', methods=['POST'])
@login_required
def create_entry():
    data = request.json
    print("Received review data:", data)

    entry_form = EntryForm(data=data)
    entry_form['csrf_token'].data = request.cookies['csrf_token']

    if entry_form.validate():
        try:
            # Convert the string representation of enum values to actual enums
            system_value = [data['system']]
            region_value = [data['region']]
            progress_value = [data['progress']]

            # Check if a game with the same name, system, and region exists
            existing_game = Game.query.filter_by(
                name=data['name'],
                system=system_value,
                region=region_value,
            ).first()

            if existing_game:
                # Use the existing game's ID
                game_id = existing_game.id
            else:
                # Return an error response to indicate that the specified game does not exist
                return generate_error_response('Game does not exist.', 404)

            # Create the new entry using the obtained game ID
            new_entry = Entry(
                user_id=current_user.id,
                game_id=game_id,
                progress=progress_value,
                progress_note=data['progress_note'],
                is_now_playing=data['is_now_playing'],
                wishlist=data['wishlist'],
            )
            print('new entry error?', new_entry)
            db.session.add(new_entry)
            db.session.commit()
            print("New entry created successfully:", new_entry)

            return generate_success_response('Entry created!')

        except KeyError as e:
            print("Error creating the entry:", e)
            return generate_error_response(f'Invalid enum value: {str(e)}', 400)

        # Combine form errors for EntryForm (if needed)
        return generate_error_response(entry_form.errors, 400)

    return generate_error_response('Invalid form data.', 400)
# Create new game
@entry_routes.route('/games', methods=['POST'])
@login_required
def create_game():
    data = request.json
    print("Received data:", data)

    game_form = GameForm(data=data)
    game_form['csrf_token'].data = request.cookies['csrf_token']

    if game_form.validate():
        try:
            # Convert the string representation of enum values to actual enums
            system_value = [data['system']]
            region_value = [data['region']]

            # Validate the incoming data here and create a new game entry.
            new_game = Game(
                name=data['name'],
                system=system_value,
                region=region_value
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

# Create new review
@entry_routes.route('/reviews', methods=['POST'])
@login_required
def create_review():
    data = request.json
    print("Received review data:", data)

    review_form = ReviewForm(data=data)
    review_form['csrf_token'].data = request.cookies['csrf_token']

    if review_form.validate():
        try:
            # Validate the incoming data here and create a new review entry.
            new_review = Review(
                user_id=current_user.id,
                entry_id=data.get('entry_id'),
                game_id=data.get('game_id'),
                rating=review_form.rating.data,
                review_text=review_form.review_text.data
            )
            db.session.add(new_review)
            db.session.commit()

            return generate_success_response({'message': 'Review created successfully.', 'review': new_review.to_dict()})

        except Exception as e:
            db.session.rollback()  # Roll back the transaction in case of an error
            return generate_error_response(f'Error creating the review: {str(e)}', 500)

    else:
        return generate_error_response('Invalid form data.', 400)

# Update an entry
@entry_routes.route('/<int:entry_id>', methods=['PUT'])
@login_required
def update_entry(entry_id):
    entry = Entry.query.get(entry_id)

    if not entry:
        return generate_error_response('Entry not found.', 404)

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to update this entry.', 403)

    data = request.get_json()
    entry_form = EntryForm(data=data)
    entry_form['csrf_token'].data = request.cookies['csrf_token']
    game_form = GameForm(data=data)
    game_form['csrf_token'].data = request.cookies['csrf_token']
    review_form = ReviewForm(data=data)
    review_form['csrf_token'].data = request.cookies['csrf_token']

    if entry_form.validate() and game_form.validate() and review_form.validate():
        entry.progress = entry_form.progress.data
        entry.progress_note = entry_form.progress_note.data
        entry.is_now_playing = entry_form.is_now_playing.data
        entry.wishlist = entry_form.wishlist.data

        game = Game.query.get(entry.game_id)
        if not game:
            game = Game(
                name=game_form.name.data,
                system=game_form.system.data,
                region=game_form.region.data
            )
            db.session.add(game)
        else:
            game.name = game_form.name.data
            game.system = game_form.system.data
            game.region = game_form.region.data

        db.session.commit()
        entry.game_id = game.id

        review = Review.query.filter_by(entry_id=entry_id).first()
        if not review:
            review = Review(
                user_id=current_user.id,
                entry_id=entry_id,
                game_id=entry.game_id,
                rating=review_form.rating.data,
                review_text=review_form.review_text.data
            )
            db.session.add(review)
        else:
            review.rating = review_form.rating.data
            review.review_text = review_form.review_text.data

        db.session.commit()

        return generate_success_response('Entry and game updated!')
    else:
        return generate_error_response('Invalid form data.', 400)

#Delete an entry
@entry_routes.route('/<int:entry_id>', methods=["DELETE"])
@login_required
def delete_board(entry_id):
    entry = Entry.query.get(entry_id)

    if not entry:
        return generate_error_response('Entry not found.', 404)

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to delete this entry.', 403)

    db.session.delete(entry)
    db.session.commit()

    return generate_success_response({'message': 'Entry deleted successfully.'})

#Delete a game within an entry
@entry_routes.route('/<int:entry_id>/games/<int:game_id>', methods=['DELETE'])
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

#Delete a review within an entry
@entry_routes.route('/<int:entry_id>/reviews/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(entry_id, review_id):
    entry = Entry.query.get(entry_id)

    if not entry:
        return generate_error_response('Entry not found.', 404)

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to delete this review.', 403)

    review = Review.query.get(review_id)

    if not review or review.entry_id != entry.id:
        return generate_error_response('Review not found.', 404)

    db.session.delete(review)
    db.session.commit()

    return generate_success_response({'message': 'Review deelted successfully.'})
