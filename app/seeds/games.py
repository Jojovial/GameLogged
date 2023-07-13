from app.models.game import db, Game, environment, SCHEMA, Region, System
from sqlalchemy.sql import text

def seed_games():
    game_1 = Game(
        name = 'Tales of Symphonia', system = System.GameCube, region=Region.NAM
    )
    game_2 = Game(
        name = 'Dragon Quest Monsters: Joker 3', system = System.Nintendo_3DS, region =Region.JP
    )
    game_3 = Game(
        name = 'Jelly Boy', system= System.Super_Nintendo_Entertainment_System, region=Region.PAL
    )


    db.session.add(game_1)
    db.session.add(game_2)
    db.session.add(game_3)

    db.session.commit()

def undo_games():
    if environment == 'production':
        db.session.execute(f"TRUNCATE table {SCHEMA}.games RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM games"))

    db.session.commit()
