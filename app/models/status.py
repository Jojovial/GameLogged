from .db import db, environment, SCHEMA, add_prefix_for_prod
from enum import Enum


class GameStatus(Enum):
    UNFINISHED = 'Unfinished'
    BEATEN = 'Beaten'
    COMPLETED = 'Completed'

class Status(db.Model):
    __tablename__ = 'statuses'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    entry_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('entries.id')), nullable=False)
    game_status = db.Column(db.Enum(GameStatus), nullable=False)


    #Relationships
    entry_status = db.relationship('Entry', back_populates='status', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'entry_id': self.entry_id,
            'game_status': self.game_status
        }
