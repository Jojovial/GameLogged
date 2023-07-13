from app.models.status import db, Status, environment, SCHEMA, GameStatus
from sqlalchemy.sql import text

def seed_statuses():
    status_1 = Status(
        entry_id = 1, game_status =GameStatus.Unplayed
    )
    status_2 = Status(
        entry_id = 2, game_status = GameStatus.Unfinished
    )
    status_3 = Status(
        entry_id = 3, game_status = GameStatus.Completed
    )

    db.session.add(status_1)
    db.session.add(status_2)
    db.session.add(status_3)
    db.session.commit()

def undo_statuses():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.stauses RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM statuses"))

    db.session.commit()
