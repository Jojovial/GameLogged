from app import db
from app.models import User
from app.models.comment import Comment
from app.models.user_comment import user_comment

def seed_user_comments():
    users = User.query.all()
    comments = Comment.query.all()

    join_data = [
        {'user_id': user.id, 'comment_id': comment.id}
        for user in users
        for comment in comments
    ]

    db.session.execute(user_comment.insert().values(join_data))
    db.session.commit()
