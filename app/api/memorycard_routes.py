from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.memory_card import MemoryCard
from app.models.entry import Entry
from app.models.db import db
from app.forms.forms import MemoryCardForm
from app.ultis import generate_error_response, generate_success_response
from sqlalchemy import asc


memory_routes = Blueprint('memory', __name__, url_prefix='/memory')

#Get memorycard by id
@memory_routes.route('/<int:memory_card_id>', methods=['GET'])
@login_required
def get_memory_card(memory_card_id):
    memory_card = MemoryCard.query.get(memory_card_id)

    if not memory_card:
        return generate_error_response('Memory Card not found.', 404)

    if memory_card.user_id != current_user.id:
        return generate_error_response('Unauthorized to access this memory card.', 403)

    return generate_success_response({'memory_card': memory_card.to_dict()})

#Get all memorycards by current user
@memory_routes.route('/all', methods=['GET'])
@login_required
def get_all_memorycards():
    memory_cards = MemoryCard.query.filter_by(user_id=current_user.id)

    memory_cards_data = [memory_card.to_dict() for memory_card in memory_cards]
    return generate_success_response({'memory_cards' : memory_cards_data})

# Create new memorycard log
@memory_routes.route('', methods=['POST'])
@login_required
def create_memory_card():
    data = request.json
    print('Received data for memory card', data)

    entry_id = data.get('entry_id')
    log_info = data.get('log_info')
    memory_card_form = MemoryCardForm(data=data)
    memory_card_form['csrf_token'].data = request.cookies['csrf_token']

    if memory_card_form.validate() and entry_id is not None:
        new_memory_card = MemoryCard(
            user_id=current_user.id,
            entry_id=entry_id,
            log_info=log_info
        )

        db.session.add(new_memory_card)
        db.session.commit()

        return generate_success_response({'message': 'Log created!', 'memory_card': new_memory_card.to_dict()})

    return generate_error_response('Invalid form data or missing entry_id', 400)
#Edit memory log
@memory_routes.route('/<int:memory_card_id>', methods=['PUT'])
@login_required
def update_memory_card(memory_card_id):
    memory_card = MemoryCard.query.get(memory_card_id)

    if not memory_card:
        return generate_error_response('Memory Card not found.', 404)

    if memory_card.user_id != current_user.id:
        return generate_error_response('Unauthorized to update this entry', 403)

    data = request.json
    memory_form = MemoryCardForm(data=data)
    memory_form['csrf_token'].data = request.cookies['csrf_token']

    if memory_form.validate():
        entry_id = data.get('entry_id')
        log_info = data.get('log_info')


        if entry_id is not None:
            entry = Entry.query.get(entry_id)
            if not entry:
                return generate_error_response('Invalid entry_id', 400)
            memory_card.entry_id = entry_id

        memory_card.log_info = log_info

        db.session.commit()

        return generate_success_response('Log updated!')
    else:
        return generate_error_response('Invalid form data.', 400)

#Delete memory log
@memory_routes.route('/<int:memory_card_id>', methods=['DELETE'])
@login_required
def delete_memory_card(memory_card_id):
    memory_card = MemoryCard.query.get(memory_card_id)

    if not memory_card:
        return generate_error_response('Memory Card not found', 404)
    if memory_card.user_id != current_user.id:
        return generate_error_response('Unauthorized to delete this log', 403)
    db.session.delete(memory_card)
    db.session.commit()

    return generate_success_response({'message': 'Log deleted successfully'})
