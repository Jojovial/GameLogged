from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, SelectField, FormField
from wtforms.validators import DataRequired, ValidationError, Length
from app.models.game import System, Region
from app.models.status import GameStatus
from app.models.entry import Progress



class CommentForm(FlaskForm):
    """
    Form for creating a comment
    """
    user_id = IntegerField('user_id', validators=[DataRequired()])
    comment_text = StringField('comment_text', validators=[DataRequired(), Length(max=500)])
class ReviewForm(FlaskForm):
    user_id = IntegerField('user_id')
    game_id = IntegerField('game_id')
    rating = IntegerField('rating')
    review_text = StringField('review_text', validators=[Length(max=300)])
class GameForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(), Length(max=100)])
    system = SelectField('system', choices=[(system.value, system.name) for system in System])
    region = SelectField('region', choices=[(region.value, region.name) for region in Region])

class EntryForm(FlaskForm):
    """
    Form for creating an entry
    """
    user_id = IntegerField('user_id')
    game_id = IntegerField('game_id')
    progress = SelectField('progress', choices=[(progress.value, progress.name) for progress in Progress])
    progress_note = StringField('progress_note', validators=[Length(max=300)])
    is_now_playing = BooleanField('is_now_playing')
    wishlist = BooleanField('wishlist')



class MemoryCardForm(FlaskForm):
    user_id = IntegerField('user_id', validators=[DataRequired()])
    entry_id = IntegerField('entry_id', validators=[DataRequired()])
    log_info = StringField('log_info', validators=[DataRequired(), Length(max=200)])


class StatusForm(FlaskForm):
    entry_id = IntegerField('entry_id', validators=[DataRequired()])
    game_status = SelectField('game_status', choices=[('Unplayed', 'Unplayed'), ('Unfinished', 'Unfinished'), ('Beaten', 'Beaten'), ('Completed', 'Completed')], validators=[DataRequired()])
