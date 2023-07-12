from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user_review import user_review


class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.String(300), nullable=False)


    #Relationships
    users = db.relationship('User', secondary=user_review, back_populates='reviews', lazy=True)
    game_reviews = db.relationship('Game', back_populates='reviews', lazy=True)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'rating': self.rating,
            'review_text': self.review_text
        }
