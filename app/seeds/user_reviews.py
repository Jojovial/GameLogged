from app import db
from app.models import User
from app.models.review import Review
from app.models.user_review import user_review

def seed_user_reviews():
    users = User.query.all()
    reviews = Review.query.all()

    join_data = [
        {'user_id': user.id, 'review_id': review.id}
        for user in users
        for review in reviews
    ]


    db.session.execute(user_review.insert().values(join_data))
    db.session.commit()
