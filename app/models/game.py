from .db import db, environment, SCHEMA, add_prefix_for_prod


class Game(db.Model):
    __tablename__ = 'games'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    system = db.Column(db.String, nullable=False)
    region = db.Column(db.String, nullable=False)

    #Relationships
    entries = db.relationship('Entry', back_populates='game_entries', cascade='all, delete-orphan')
    reviews = db.relationship('Review', back_populates='game_reviews', cascade='all, delete-orphan')




    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'system': self.system,
            'region': self.region
        }
