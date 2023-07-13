from .db import db, SCHEMA, environment, add_prefix_for_prod

user_review = db.Table(
    add_prefix_for_prod('user_review'),
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('review_id', db.Integer, db.ForeignKey(add_prefix_for_prod('reviews.id')), primary_key=True),
    schema=add_prefix_for_prod(SCHEMA) if environment == "production" else None
)
