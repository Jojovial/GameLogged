from app.models.game import db, Game, environment, SCHEMA
from sqlalchemy.sql import text

def seed_games():
    game_1 = Game(
        name = 'Tales of Symphonia', system = 'GameCube', region='NAM'
    )
    game_2 = Game(
        name = 'Dragon Quest Monsters: Joker 3', system = 'Nintendo 3DS', region ='JP'
    )
    game_3 = Game(
        name = 'Jelly Boy', system=  'Super Nintendo Entertainment System', region='PAL'
    )


    db.session.add(game_1)
    db.session.add(game_2)
    db.session.add(game_3)

def undo_games():
    if environment == 'production':
        db.session.execute(f'TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;')
    else:
        db.session.execute(text("DELETE FROM comments"))

    db.session.commit()
