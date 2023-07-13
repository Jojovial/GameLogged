from .db import db, SCHEMA, environment, add_prefix_for_prod

user_entry = db.Table(
    'user_entry',
    db.Column('user_id', db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), primary_key=True),
    db.Column('entry_id', db.Integer, db.ForeignKey(add_prefix_for_prod('entries.id')), primary_key=True),


)


