from .db import db, environment, SCHEMA, add_prefix_for_prod



class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), nullable=False)
    entry_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('entries.id')), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    review_text = db.Column(db.String(300), nullable=True)


    #Relationships
    users = db.relationship('User', back_populates='reviews', lazy=True)
    game_reviews = db.relationship('Game', back_populates='reviews', lazy=True)
    entry = db.relationship('Entry', back_populates='reviews', lazy=True)
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'entry_id': self.entry_id,
            'rating': self.rating,
            'review_text': self.review_text
        }
