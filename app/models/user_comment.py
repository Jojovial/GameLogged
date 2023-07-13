from .db import db, SCHEMA, environment


user_comment = db.Table(
    'user_comment',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('comment_id', db.Integer, db.ForeignKey('comments.id'), primary_key=True)
)


if environment == "production":
   user_comment.schema = SCHEMA
