from .db import db, environment, SCHEMA, add_prefix_for_prod

class MemoryCard(db.Model):
    __tablename__ = 'memory_cards'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    entry_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('entries.id')), nullable=False)
    log_info = db.Column(db.String(200), nullable=False)


    #Relationship
    user_logs = db.relationship('User', back_populates='logs',lazy=True)
    entry_logs = db.relationship('Entry', back_populates='logs',lazy=True)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'entry_id': self.entry_id,
            'log_info': self.log_info
        }
