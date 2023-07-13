from app.models.review import db, Review, environment, SCHEMA
from sqlalchemy.sql import text


def seed_reviews():
    review_1 = Review(
     user_id = 1, game_id = 1, rating= 0, review_text =""
    )
    review_2 = Review(
     user_id = 2, game_id = 2, rating = 4, review_text = "Almost done but lengthy grind."
    )
    review_3 = Review(
     user_id = 3, game_id = 3, rating = 5, review_text = "JELLY BOY IS SO GOOD OMG!!!!"
    )

    db.session.add(review_1)
    db.session.add(review_2)
    db.session.add(review_3)
    db.session.commit()

def undo_reviews():
    if environment == "production":
        db.session.execute(f"DELETE FROM {SCHEMA}.reviews;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
