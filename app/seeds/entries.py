from app.models.entry import db, Entry, environment, SCHEMA
from sqlalchemy.sql import text

def seed_entries():
    entry_one = Entry(
        user_id = 1, game_id = 1,
        progress = 'Unplayed', progress_note = "I will play this!",
        is_now_playing=False, wishlist=True
    )

    entry_two = Entry(
        user_id = 2, game_id = 2,
        progress='Unfinished', progress_note="Almost done!",
        is_now_playing=True, wishlist=False
    )

    entry_three = Entry(
        user_id = 3, game_id = 3,
        progress='Beaten', progress_note="I beat it!",
        is_now_playing=False, wishlist=False
    )

    db.session.add(entry_one)
    db.session.add(entry_two)
    db.session.add(entry_three)
    db.session.commit()


def undo_entries():
        if environment == 'production':
            db.session.execute(f"TRUNCATE table {SCHEMA}.entries RESTART IDENTITY CASCADE;")
        else:
            db.session.execute(text("DELETE FROM entries"))
        db.session.commit()
