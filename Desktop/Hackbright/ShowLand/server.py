"""Server for ShowLand app"""

from flask import Flask, render_template, request, flash, session, redirect, jsonify
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined
import requests
import json
import os

app = Flask(__name__)
app.secret_key = "you-shouldnt-know"
app.jinja_env.undefined = StrictUndefined


@app.route('/')
def homepage():
    """Display homepage"""
    return render_template('homepage.html')


@app.route('/movies')
def all_movies():
    return render_template('movies.html')

# API Request to show the most popular movies


@app.route('/movies/popular')
def all_popular_movies():
    """Display all popular movies"""
    tmdb_api_key = os.environ['TMDB_API_KEY']
    print(tmdb_api_key)
    response = requests.get(
        f"https://api.themoviedb.org/3/movie/popular?api_key={tmdb_api_key}&language=en-US&page=1")
    data = response.json()
    return data

# API Request using the query string from movies.js


@app.route('/search')
def search_media():
    url = "https://movie-database-alternative.p.rapidapi.com/"
    headers = {
        "X-RapidAPI-Key": os.environ['RAPID_API_KEY'],
        "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com"
    }
    searched_media = request.args.get("s")
    query_string = {"s": searched_media, "r": "json", "page": "1"}
    response = requests.request(
        "GET", url, headers=headers, params=query_string)
    data = response.json()

   # session[searched_media] = data['Search']

    return data



@app.route('/shows')
def all_shows():
    """Display all shows"""
    pass


@app.route('/movies/details/<imdb_id>')
def get_specific_movie(imdb_id):
    """Makes an API request to get a specific movie by its ID"""

    url = "https://movie-database-alternative.p.rapidapi.com/"

    query_string = {"r": "json", "i": imdb_id}

    headers = {
        "X-RapidAPI-Key": os.environ['RAPID_API_KEY'],
        "X-RapidAPI-Host": "movie-database-alternative.p.rapidapi.com"
    }
    response = requests.request(
        "GET", url, headers=headers, params=query_string)

    data = response.json()


    movie = {'title': data['Title'], 'year': data['Year'], 'poster_path': data['Poster'], 'overview': data['Plot'], 'movie_id': data['imdbID'] }
    return render_template('movie_details.html', movie=movie)


@app.route('/movies/details/')
def show_details():
    return render_template('movie_details.html')

@app.route('/movie/details/<movie_id>/comment', methods=['POST'])
def comment_movie(movie_id):


    movie_title = request.json.get('title')
    movie_year = request.json.get('year')
    movie_poster_path = request.json.get('poster_path')
    movie_overview = request.json.get('overview')
    movie_imdb_id = request.json.get('imdb_id')
    movie_rate = request.json.get('user_rate')
    movie_comment = request.json.get('user_comment')

    if 'user_email' in session:

        user = crud.get_user_by_email(session['user_email'])
        movie = crud.get_media_by_imdb_id(movie_id)
        if movie:
            user_comment = crud.create_comment(
                                comment=movie_comment,
                                review=movie_rate, 
                                user_id=user.user_id, 
                                media_id=movie.media_id)
            db.session.add(user_comment)
            db.session.commit()
        else:
            movie_to_db = crud.create_media(
                               media_type='movie', 
                               title=movie_title, 
                               overview=movie_overview, 
                               poster_path=movie_poster_path, 
                               imdb_id=movie_imdb_id)
            db.session.add(movie_to_db)
            db.session.commit()      

            user_comment = crud.create_comment(
                                comment=movie_comment, 
                                review=movie_rate, 
                                user_id=user.user_id, 
                                media_id=movie_to_db.media_id)

            db.session.add(user_comment)
            db.session.commit()
        
    else:
        return redirect('/login')

    return redirect('/movies')



@app.route('/shows/<show_id>')
def show_specific_show():
    """Show details on a particular tv show"""
    pass


@app.route('/login')
def login_page():
    """Show log in page"""
    if 'user_email' in session:
        user = crud.get_user_by_email(session['user_email'])
        user_id = user.user_id
        return redirect(f'/profile/{user_id}')
      #  return render_template('profile.html', user=user)
    else:    
        return render_template('login.html')


@app.route('/login', methods=['POST'])
def login_user():
    """User log in"""

    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)
    if user and password == user.password:
        flash(f'Hi, {user.full_name}')
        session['user_email'] = user.email
        return redirect('/')
    else:
        flash(f'Email or password incorrect')
        return redirect('login')

@app.route('/logout')
def logout():

    session.pop('user_email',None)
    flash("You're logged out!")
    return redirect('/')

@app.route('/signup')
def signin_page():
    return render_template('signup.html')


@app.route('/signup', methods=["POST"])
def register_user():
    """Create a new user"""

    fullname = request.form.get("full_name")
    email = request.form.get("email")
    password = request.form.get("password")
    confirm_password = request.form.get("confirm-password")

    user = crud.get_user_by_email(email)

    if user:
        flash("Cannot create an account with that email. Try again.")
        return redirect('/signin')
    else:
        if password == confirm_password:
            user = crud.create_user(fullname, email, password)
            db.session.add(user)
            db.session.commit()
            flash("Account created! Please, log in.")
        else:
            flash("Password do not match. Try again.")
            return redirect('signin')

    return render_template('login.html')


@app.route('/profile/<user_id>')
def show_profile(user_id):
    """Show users profile"""

    user = crud.get_user_by_email(session['user_email'])
    user_id = user_id

    

    return render_template('profile.html', user=user)


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
