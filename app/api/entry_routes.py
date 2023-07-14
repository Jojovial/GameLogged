from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.entry import Entry, Progress
from app.models.db import db
from app.models.review import Review
from app.models.game import Game, System, Region
from app.forms.forms import EntryForm, GameForm, ReviewForm
from app.ultis import generate_error_response, generate_success_response
from sqlalchemy import asc


entry_routes = Blueprint('entries', __name__, url_prefix='/entry')

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

    return generate_success_response({'entry': entry_data})

#GET all entries by current user
@entry_routes.route('', methods=['GET'])
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
@entry_routes('', methods=['POST'])
@login_required
def create_entry():
    entry_form = EntryForm(request.form)
    entry_form['csrf_token'].data = request.cookies['csrf_token']
    game_form = GameForm(request.form)
    game_form['csrf_token'].data = request.cookies['csrf_token']
    review_form = ReviewForm(request.form)
    review_form['csrf_token'].data = request.cookies['csrf_token']

    if entry_form.validate_on_submit() and game_form.vadliate_on_submit() and review_form.validate_on_submit():
        new_entry = Entry(
            user_id=current_user.id,
            game_id=None,
            progress=entry_form.progress.data,
            progress_note=entry_form.progress_note.data,
            is_now_playing=entry_form.is_now_playing.data,
            wishlist=entry_form.wishlist.data
        )
        db.session.add(new_entry)
        db.session.commit()

        new_game = Game(
            name=game_form.name.data,
            system=game_form.system.data,
            region=game_form.region.data
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
            comment = review_form.comment.data

        )
        db.session.add(new_review)
        db.session.commit()

        return generate_success_response('Entry created!')
    else:
        return generate_error_response('Invalid form data.')
