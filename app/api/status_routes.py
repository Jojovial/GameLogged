from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.status import Status
from app.models.db import db
from app.forms.forms import StatusForm
from app.ultis import generate_error_response, generate_success_response
from sqlalchemy import asc


status_routes = Blueprint('status', __name__, url_prefix='/status')

@status_routes.route('/<int:status_id>', methods=["GET"])
@login_required
def get_status(status_id):
    status = Status.query.get(status_id)

    if not status:
        return generate_error_response('Status not found.', 404)

    entry = status.entry_status

    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to access this status.', 403)

    return generate_success_response({'status': status.to_dict()})
#GET all statuses by current user
@status_routes.route('/all', methods=['GET'])
@login_required
def get_statuses():
    statuses = Status.query.filter_by(user_id=current_user.id).order_by(asc(Status.id)).all()
    status_data = [status.to_dict() for status in statuses]
    return generate_success_response({'statuses': status_data})

# Create new status
@status_routes.route('', methods=['POST'])
@login_required
def create_status():
    data = request.json

    status_form = StatusForm(data=data)
    status_form['csrf_token'].data = request.cookies['csrf_token']

    if status_form.validate():
        try:
            new_status = Status(
                entry_id=data['entry_id'],  # assign entry_id here
                game_status=data['game_status']
            )
            db.session.add(new_status)
            db.session.commit()

            return generate_success_response({'message': 'Status successfully created', 'status': new_status.to_dict()})
        except KeyError as e:
            return generate_error_response(f'Invalid value: {str(e)}', 400)

    return generate_error_response('Invalid form data.', 400)

# Update a status
@status_routes.route('/<int:status_id>', methods=['PUT'])
@login_required
def update_status(status_id):
    status = Status.query.get(status_id)

    if not status:
        return generate_error_response('Status not found.', 404)

    # Get the associated entry
    entry = status.entry_status

    # Check if the current user is associated with the entry linked to the status
    if entry.user_id != current_user.id:
        return generate_error_response('Unauthorized to update this status.', 403)

    data = request.json
    status_form = StatusForm(data=data)
    status_form['csrf_token'].data = request.cookies['csrf_token']

    if status_form.validate():
        try:
            status.game_status = data['game_status']
            db.session.commit()
            return generate_success_response('Status updated!')
        except KeyError as e:
            return generate_error_response(f'Invalid enum value: {str(e)}', 400)
    else:
        return generate_error_response('Invalid form data.', 400)

#Delete status
@status_routes.route('/<int:status_id>', methods=['DELETE'])
@login_required
def delete_status(status_id):
    status = Status.query.get(status_id)

    if not status:
        return generate_error_response('Status not found.', 404)

    if status.user_id != current_user.id:
        return generate_error_response('Unauthorized to delete this status', 403)

    db.session.delete(status)
    db.session.commit()

    return generate_success_response({'message': 'Status deleted!'})
