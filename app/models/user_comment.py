from .db import db, SCHEMA, environment,add_prefix_for_prod


user_comment = db.Table(
    add_prefix_for_prod('user_comment'),
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('comment_id', db.Integer, db.ForeignKey(add_prefix_for_prod('comments.id')), primary_key=True)
)


