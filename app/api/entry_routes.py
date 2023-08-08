from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.entry import Entry
from app.models.db import db
from app.forms.forms import EntryForm
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
        return generate_error_response('Unauthorized to access this entry.', 403)

    return generate_success_response({'entry': entry.to_dict()})


#GET all entries by current user
@entry_routes.route('/all', methods=['GET'])
@login_required
def get_entries():
    entries = Entry.query.filter_by(user_id=current_user.id).order_by(asc(Entry.id)).all()
    entries_data = [entry.to_dict() for entry in entries]
    return generate_success_response({'entries': entries_data})

# Create new entry
@entry_routes.route('', methods=['POST'])
@login_required
def create_entry():
    data = request.json
    print("Received entry data:", data)

    entry_form = EntryForm(data=data)
    entry_form['csrf_token'].data = request.cookies['csrf_token']

    if entry_form.validate():
        try:
            new_entry = Entry(
                user_id=current_user.id,
                game_name=data['game_name'],
                system=data['system'],
                region=data['region'],
                progress=data['progress'],
                progress_note=data['progress_note'],
                rating=data['rating'],
                review_text=data['review_text'],
                is_now_playing=data['is_now_playing'],
                wishlist=data['wishlist'],
            )
            db.session.add(new_entry)
            db.session.commit()
            print("New entry created successfully:", new_entry)

            return generate_success_response({'message': 'Entry created!', 'entry': new_entry.to_dict()})

        except KeyError as e:
            print("Error creating the entry:", e)
            return generate_error_response(f'Invalid enum value: {str(e)}', 400)

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

    data = request.json
    entry_form = EntryForm(data=data)
    entry_form['csrf_token'].data = request.cookies['csrf_token']

    if entry_form.validate():
        entry.game_name = data['game_name']
        entry.system = data['system']
        entry.region = data['region']
        entry.progress = data['progress']
        entry.progress_note = data['progress_note']
        entry.rating = data['rating']
        entry.review_text = data['review_text']
        entry.is_now_playing = data['is_now_playing']
        entry.wishlist = data['wishlist']

        db.session.commit()

        return generate_success_response('Entry updated!')
    else:
        return generate_error_response('Invalid form data.', 400)



#Delete an entry
@entry_routes.route('/<int:entry_id>', methods=["DELETE"])
@login_required
def delete_entry(entry_id):
    entry = Entry.query.get(entry_id)

    if not entry:
        return generate_error_response('Entry not found.', 404)

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to delete this entry.', 403)

    db.session.delete(entry)
    db.session.commit()

    return generate_success_response({'message': 'Entry deleted successfully.'})
