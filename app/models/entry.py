from .db import db, environment, SCHEMA, add_prefix_for_prod


class Entry(db.Model):
    __tablename__ = 'entries'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_name = db.Column(db.String(100), nullable=False)
    system = db.Column(db.String, nullable=False)
    region = db.Column(db.String, nullable=False)
    progress = db.Column(db.String, nullable=False)
    progress_note = db.Column(db.String(300), nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    review_text = db.Column(db.String(300), nullable=True)
    is_now_playing = db.Column(db.Boolean)
    wishlist = db.Column(db.Boolean)

    # Relationships
    users = db.relationship('User', back_populates="entries")
    logs = db.relationship('MemoryCard', back_populates="entry_logs")
    status = db.relationship('Status', back_populates="entry_status")
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_name': self.game_name,
            'system': self.system,
            'region': self.region,
            'progress': self.progress,
            'progress_note': self.progress_note,
            'rating': self.rating,
            'review_text': self.review_text,
            'is_now_playing': self.is_now_playing,
            'wishlist': self.wishlist
        }
