from flask_wtf import FlaskForm
from wtforms import StringField, BooleanField, IntegerField, SelectField, FormField
from wtforms.validators import DataRequired, ValidationError, Length


SYSTEM_CHOICES = [
    "PC",
    "GameCube",
    "GameBoy",
    "GameBoyColor",
    "GameBoyAdvance",
    "Nintendo3DS",
    "Nintendo64",
    "NES",
    "SNES",
    "NintendoSwitch",
    "PlayStation",
    "PlayStation2",
    "PlayStation3",
    "PlayStation4",
    "PlayStation5",
    "PSP",
    "PlayStationVita",
    "Phone",
    "Wii",
    "WiiU",
    "Xbox",
    "Xbox360",
    "XboxOne",
    "Other",
]

REGION_CHOICES = [
    'NAM',
    'JP',
    'PAL',
    'CN',
    'KR',
    'BR',
    'Other',
]

PROGRESS_CHOICES = [
    'Unplayed',
    'Unfinished',
    'Beaten',
    'Completed',
]


class CommentForm(FlaskForm):
    """
    Form for creating a comment
    """
    comment_text = StringField('comment_text', validators=[DataRequired(), Length(max=500)])


class EntryForm(FlaskForm):
    """
    Form for creating an entry
    """
    user_id = IntegerField('user_id')
    game_name = StringField('name', validators=[DataRequired(), Length(max=100)])
    system = SelectField('system', choices=SYSTEM_CHOICES)
    region = SelectField('region', choices=REGION_CHOICES)
    progress = SelectField('progress', choices=PROGRESS_CHOICES)
    progress_note = StringField('progress_note', validators=[Length(max=300)])
    rating = IntegerField('rating')
    review_text = StringField('review_text', validators=[Length(max=300)])
    is_now_playing = BooleanField('is_now_playing')
    wishlist = BooleanField('wishlist')



class MemoryCardForm(FlaskForm):
    log_info = StringField('log_info', validators=[DataRequired(), Length(max=200)])


class StatusForm(FlaskForm):
    entry_id = IntegerField('entry_id', validators=[DataRequired()])
    game_status = SelectField('game_status', choices=PROGRESS_CHOICES)
