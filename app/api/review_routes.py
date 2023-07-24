from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models.entry import Entry
from app.models.db import db
from app.models.review import Review
from app.models.game import Game
from app.forms.forms import EntryForm, GameForm, ReviewForm
from app.ultis import generate_error_response, generate_success_response
from sqlalchemy import asc


review_routes = Blueprint('reviews', __name__, url_prefix='/reviews')




# Get a review by ID
@review_routes.route('/<int:review_id>', methods=['GET'])
@login_required
def get_review_by_id(review_id):
    review = Review.query.get(review_id)

    if not review:
        return generate_error_response('Review not found.', 404)

    if review.user_id != current_user.id:
        return generate_error_response('Unauthorized to access this review.', 403)

    review_data = {
        'id': review.id,
        'game_id': review.game_id,
        'rating': review.rating,
        'review_text': review.review_text
    }

    # Fetch game details associated with the review's game_id
    game = Game.query.get(review.game_id)
    if game:
        review_data['game'] = {
            'id': game.id,
            'name': game.name,
            'system': game.system,
            'region': game.region
        }

    return generate_success_response({'review': review_data})
@review_routes.route('/all', methods=['GET'])
@login_required
def get_user_reviews():
    user_reviews = Review.query.filter_by(user_id=current_user.id).all()

    reviews_data = []
    for review in user_reviews:
        review_data = {
            'id': review.id,
            'game_id': review.game_id,
            'rating': review.rating,
            'review_text': review.review_text
        }

        # Fetch game details associated with the review's game_id
        game = Game.query.get(review.game_id)
        if game:
            review_data['game'] = {
                'id': game.id,
                'name': game.name,
                'system': game.system,
                'region': game.region
            }

        reviews_data.append(review_data)

    return generate_success_response({'reviews': reviews_data})


# Create new review
@review_routes.route('', methods=['POST'])
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




# Update a review
@review_routes.route('/<int:review_id>', methods=['PUT'])
@login_required
def update_review(review_id):
    review = Review.query.get(review_id)

    if not review:
        return generate_error_response('Review not found.', 404)

    if review.user_id != current_user.id:
        return generate_error_response('Unauthorized to update this review.', 403)

    data = request.get_json()
    review_form = ReviewForm(data=data)
    review_form['csrf_token'].data = request.cookies['csrf_token']

    if review_form.validate():
        # Update the review fields based on the form data
        review.rating = review_form.rating.data
        review.review_text = review_form.review_text.data

        db.session.commit()

        return generate_success_response('Review updated successfully!')
    else:
        return generate_error_response('Invalid form data.', 400)



# Delete a review
@review_routes.route('/<int:review_id>', methods=['DELETE'])
@login_required
def delete_review(review_id):
    review = Review.query.get(review_id)

    if not review:
        return generate_error_response('Review not found.', 404)

    if review.user_id != current_user.id:
        return generate_error_response('Unauthorized to delete this review.', 403)

    db.session.delete(review)
    db.session.commit()

    return generate_success_response({'message': 'Review deleted successfully.'})


