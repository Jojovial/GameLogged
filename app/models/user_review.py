from .db import db, SCHEMA, environment

user_review = db.Table(
    'user_review',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('review_id', db.Integer, db.ForeignKey('reviews.id'), primary_key=True)
)

if environment == "production":
   user_review.schema = SCHEMA
