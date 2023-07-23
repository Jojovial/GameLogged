from .db import db, environment, SCHEMA, add_prefix_for_prod





class Entry(db.Model):
    __tablename__ = 'entries'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), nullable=False)
    review_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('reviews.id')), nullable=True)
    progress = db.Column(db.String, nullable=False)
    progress_note = db.Column(db.String(300), nullable=True)
    is_now_playing = db.Column(db.Boolean)
    wishlist = db.Column(db.Boolean)

    # Relationships
    users = db.relationship('User', back_populates="entries")
    game_entries = db.relationship('Game', back_populates="entries", cascade='all, delete')
    logs = db.relationship('MemoryCard', back_populates="entry_logs")
    status = db.relationship('Status', back_populates="entry_status")
    reviews = db.relationship('Review', back_populates='entry', cascade='all, delete')
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'review_id': self.review_id,
            'progress': self.progress,
            'progress_note': self.progress_note,
            'is_now_playing': self.is_now_playing,
            'wishlist': self.wishlist
        }
