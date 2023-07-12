from .db import db, environment, SCHEMA, add_prefix_for_prod
from .user_entry import user_entry
from .user_review import user_review
from .user_comment import user_comment
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)


    #Relationships
    entries = db.relationship('Entry', secondary=user_entry, back_populates='users', cascade='all, delete-orphan')
    reviews = db.relationship('Review', secondary=user_review, back_populates='users', cascade='all, delete-orphan')
    logs = db.relationship('MemoryCard', back_populates='user_logs', cascade='all, delete-orphan')
    comments = db.relationship('Comment', secondary=user_comment, back_populates='user_comments', cascade='all, delete-orphan')
    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email
        }
