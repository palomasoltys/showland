"""CRUD operations"""
from model import db, User, Media, Comment, SaveForLater


def create_user(full_name, email, password):
    """Create and return a new user"""

    user = User(full_name=full_name,
                email=email,
                password=password)

    return user


def get_user_by_email(email):
    """Return a user by email."""

    return User.query.filter_by(email=email).first()

def create_media(media_type, title, overview, poster_path, imdb_id):
    """Create and return a new media"""

    media = Media(media_type=media_type,title=title, overview=overview, poster_path=poster_path, imdb_id=imdb_id)

    return media

def get_media_by_imdb_id(imdb_id):

    return Media.query.filter_by(imdb_id=imdb_id).first()

def create_comment(comment, review, media_id, user_id,):

    comment = Comment(comment=comment, review=review, media_id=media_id, user_id=user_id)

    return comment


if __name__ == "__main__":
    from server import app

    connect_to_db(app)
