from app import db
from app.models import User
from app.models.entry import Entry
from app.models.user_entry import user_entry

def seed_user_entries():
    users = User.query.all()
    entries = Entry.query.all()

    join_data = [
        {'user_id': user.id, 'entry_id': entry.id}
        for user in users
        for entry in entries
    ]

    db.session.execute(user_entry.insert().values(join_data))
    db.session.commit()
