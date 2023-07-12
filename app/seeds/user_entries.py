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

    unique_join_data = []
    seen_entry_ids = set()
    for data in join_data:
        entry_id = data['entry_id']
        if entry_id not in seen_entry_ids:
            unique_join_data.append(data)
            seen_entry_ids.add(entry_id)

    db.session.execute(user_entry.insert().values(unique_join_data))
    db.session.commit()

def undo_user_entries():
    db.session.execute(user_entry.delete())
    db.session.commit()
