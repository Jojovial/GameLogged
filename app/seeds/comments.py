from app.models.comment import db, Comment, environment, SCHEMA
from sqlalchemy.sql import text

def seed_comments():
    comment_1 = Comment(
        user_id = 1, comment_text="I do be tired"
    )
    comment_2 = Comment(
        user_id = 2, comment_text="I love games!"
    )
    comment_3 = Comment(
        user_id= 3, comment_text="My dog ate my games :("
    )

    db.session.add(comment_1)
    db.session.add(comment_2)
    db.session.add(comment_3)
    db.session.commit()


def undo_comments():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.comments RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
