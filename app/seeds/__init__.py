from flask.cli import AppGroup
from .users import seed_users, undo_users
from .comments import seed_comments, undo_comments
from .entries import seed_entries, undo_entries
from .games import seed_games, undo_games
from .memory_cards import seed_memory_cards, undo_memory_cards
from .reviews import seed_reviews, undo_reviews
from .statuses import seed_statuses, undo_statuses


from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_comments()
        undo_entries()
        undo_games()
        undo_memory_cards()
        undo_reviews()
        undo_statuses()


    seed_users()
    seed_games()
    seed_reviews()
    seed_entries()
    # Add other seed functions here
    seed_memory_cards()
    seed_comments()
    seed_statuses()



# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_statuses()
    undo_comments()
    undo_memory_cards()
    undo_entries()
    undo_reviews()
    undo_games()
    undo_users()
