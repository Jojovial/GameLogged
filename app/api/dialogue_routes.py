from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.comment import Comment
from app.models.db import db
from app.forms.forms import CommentForm
from app.ultis import generate_error_response, generate_success_response
from sqlalchemy import asc

dialogue_routes = Blueprint('comments', __name__, url_prefix='/comment')


#Get comment by id
@dialogue_routes.route('/<int:comment_id>', methods=["GET"])
@login_required
def get_comment_by_id(comment_id):
    comment = Comment.query.get(comment_id)

    if not comment:
        return generate_error_response('Comment not found.', 404)

    if comment.user_id != current_user.id:
        return generate_error_response('Unauthorized to access this comment', 403)

    comment_data = {
        'id': comment.id,
        'comment_text': comment.comment_text
    }

    return generate_success_response({'comment': comment_data})

#Get all comments by current user
@dialogue_routes.route('/all', methods=['GET'])
@login_required
def get_all_comments():
    comments = Comment.query.filter_by(user_id=current_user.id)

    comments_data = [{
        'id': comment.id,
        'comment_text': comment.comment_text
    } for comment in comments]

    return generate_success_response({'comments': comments_data})

@dialogue_routes.route('', methods=['POST'])
@login_required
def create_comment():
    comment_form = CommentForm(request.form)
    comment_form['csrf_token'].data = request.cookies['csrf_token']

    if comment_form.validate_on_submit():
        new_comment = Comment(
            user_id=current_user.id,
            comment_text = comment_form.comment_text.data
        )
        db.session.add(new_comment)
        db.session.commit()

        return generate_success_response('Comment created!')
    else:
        return generate_error_response('Invalid form data.')


#Update comment
@dialogue_routes.route('/<int:comment_id>', methods=['PUT'])
@login_required
def update_comment(comment_id):
    comment = Comment.query.get(comment_id)

    if not comment:
        return generate_error_response('Comment not found', 404)

    if comment.user_id != current_user.id:
        return generate_error_response('Unauthorized to update comment', 403)

    comment_form = CommentForm(request.form)
    comment_form['csrf_token'].data = request.cookies['csrf_token']

    if comment_form.validate_on_submit():
        comment.comment_text = comment_form.comment_text.data
        db.session.commit()
        return generate_success_response('Comment updated!')
    else:
        return generate_error_response('Invalid form data.')


#Delete comment
@dialogue_routes.route('/<int:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)

    if not comment:
        return generate_error_response('Comment not found', 404)

    if comment.user_id != current_user.id:
        return generate_error_response('Unauthorized to update comment', 403)

    db.session.delete(comment)
    db.session.commit()

    return generate_success_response({'message': 'Comment deleted!'})
