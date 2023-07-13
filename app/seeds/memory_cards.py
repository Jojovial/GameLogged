from app.models.memory_card import db, MemoryCard, environment, SCHEMA
from sqlalchemy.sql import text

def seed_memory_cards():
    memory_card_1 = MemoryCard(
        user_id = 1, entry_id = 1,
        log_info = 'One day will play this'
    )
    memory_card_2 = MemoryCard(
        user_id = 2, entry_id = 2,
        log_info = 'Ugh, gotta get the last monsters.'
    )
    memory_card_3 = MemoryCard(
        user_id = 3, entry_id = 3,
        log_info = 'JELLY BOY IS SO GOOD'
    )

    db.session.add(memory_card_1)
    db.session.add(memory_card_2)
    db.session.add(memory_card_3)
    db.session.commit()

def undo_memory_cards():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.memory_cards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM memory_cards"))

    db.session.commit()
