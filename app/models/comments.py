from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user_comment import user_comment

class Comment(db.Model):
    __tablename__ = 'comments'

    if environment == 'production':
        __table_args__ = {'schema': SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    comment_text = db.Column(db.String(500), nullable=False)

    #Relationships

    users = db.relationship('User', secondary=user_comment, back_populates='users', lazy=True)


    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'comment_text': self.comment_text
        }
