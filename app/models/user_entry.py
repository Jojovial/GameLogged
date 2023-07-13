from .db import db, SCHEMA, environment

user_entry = db.Table(
    'user_entry',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id', primary_key=True)),
    db.Column('entry_id', db.Integer, db.ForeignKey('entries.id'), primary_key=True)
)

if environment == "production":
   user_entry.schema = SCHEMA
