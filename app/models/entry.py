from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user_entry import user_entry
from enum import Enum

class Progress(Enum):
    Unplayed = 'Unplayed'
    Unfinished = 'Unfinished'
    Beaten = 'Beaten'
    Completed = 'Completed'

class Entry(db.Model):
    __tablename__ = 'entries'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('games.id')), nullable=False)
    progress = db.Column(db.Enum(Progress), nullable=False)
    progress_note = db.Column(db.String(300), nullable=True)
    is_now_playing = db.Column(db.Boolean)
    wishlist = db.Column(db.Boolean)

    # Relationships
    users = db.relationship('User', secondary=user_entry, back_populates="entries")
    game_entries = db.relationship('Game', back_populates="entries")
    logs = db.relationship('MemoryCard', back_populates="entry_logs")
    status = db.relationship('Status', back_populates="entry_status")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'progress': self.progress.value,
            'progress_note': self.progress_note,
            'is_now_playing': self.is_now_playing,
            'wishlist': self.wishlist
        }
