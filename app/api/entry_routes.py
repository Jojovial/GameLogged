from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.entry import Entry, Progress
from app.models.db import db
from app.models.review import Review
from app.models.game import Game, System, Region
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
        'system': game.system.value,
        'region': game.region.value
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
                     'progress': entry.progress.value,
                     'progress_note': entry.progress_note,
                     'is_now_playing': entry.is_now_playing,
                     'wishlist': entry.wishlist}
                     for entry in entries]
    return generate_success_response({'entries': entries_data})

#Create new entry
@entry_routes.route('', methods=['POST'])
@login_required
def create_entry():
    entry_form = EntryForm(request.form)
    entry_form['csrf_token'].data = request.cookies['csrf_token']
    game_form = GameForm(request.form)
    game_form['csrf_token'].data = request.cookies['csrf_token']
    review_form = ReviewForm(request.form)
    review_form['csrf_token'].data = request.cookies['csrf_token']

    if entry_form.validate_on_submit() and game_form.validate_on_submit() and review_form.validate_on_submit():
        new_entry = Entry(
            user_id=current_user.id,
            game_id=None,
            progress=Progress[entry_form.progress.data],
            progress_note=entry_form.progress_note.data,
            is_now_playing=entry_form.is_now_playing.data,
            wishlist=entry_form.wishlist.data
        )
        db.session.add(new_entry)
        db.session.commit()

        new_game = Game(
            name=game_form.name.data,
            system=System[game_form.system.data],
            region=Region[game_form.region.data]
        )
        db.session.add(new_game)
        db.session.commit()

        new_entry.game_id = new_game.id
        db.session.commit()

        new_review = Review(
            user_id = current_user.id,
            entry_id=new_entry.id,
            game_id = new_game.id,
            rating = review_form.rating.data,
             review_text=review_form.review_text.data

        )
        db.session.add(new_review)
        db.session.commit()

        return generate_success_response('Entry created!')
    else:
        print(entry_form.errors)
        print(game_form.errors)
        print(review_form.errors)
        return generate_error_response('Invalid form data.', 400)

#Update a entry
@entry_routes.route('/<int:entry_id>', methods=['PUT'])
@login_required
def update_entry(entry_id):
    entry = Entry.query.get(entry_id)

    if not entry:
        return generate_error_response('Entry not found.', 404)

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to update this entry', 403)


    entry_form = EntryForm(request.form)
    entry_form['csrf_token'].data = request.cookies['csrf_token']
    game_form = GameForm(request.form)
    game_form['csrf_token'].data = request.cookies['csrf_token']
    review_form = ReviewForm(request.form)
    review_form['csrf_token'].data = request.cookies['csrf_token']

    if entry_form.validate_on_submit() and game_form.validate_on_submit() and review_form.validate_on_submit():
        entry.progress = Progress[entry_form.progress.data]
        entry.progress_note = entry_form.progress_note.data
        entry.is_now_playing = entry_form.is_now_playing.data
        entry.wishlist = entry_form.wishlist.data

        game = Game.query.get(entry.game_id)
        if not game:
            game = Game(
                name = game_form.name.data,
                system = System[game_form.system.data],
                region = Region[game_form.region.data]
            )
            db.session.add(game)
            db.session.commit()
            entry.game_id = game.id

        review = Review.query.filter_by(entry_id=entry_id).first()
        if not review:
            review = Review(
                user_id=current_user.id,
                entry_id = entry_id,
                game_id = entry.game_id,
                rating = review_form.rating.data,
                comment = review_form.comment.data
            )
            db.session.add(review)
        else:
            review.rating = review_form.rating.data
            review.comment = review_form.comment.data

        db.session.commit()

        return generate_success_response('Entry updated!')
    else:
        return generate_error_response('Invalid form data.')

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
