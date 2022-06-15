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
    print(data)
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
    return data


@app.route('/shows')
def all_shows():
    """Display all shows"""
    pass


@app.route('/movies/<movie_id>')
def show_specific_movie():
    """Show details on a particular movie"""
    pass


@app.route('/shows/<show_id>')
def show_specific_show():
    """Show details on a particular tv show"""
    pass


@app.route('/login')
def login_page():
    """Show log in page"""
    return render_template('login.html')


@app.route('/login', methods=['POST'])
def login_user():
    """User log in"""

    email = request.form.get("email")
    password = request.form.get("password")

    user = crud.get_user_by_email(email)
    if user and password == user.password:
        flash(f'Hi, {user.full_name}')
        return redirect('/')
    else:
        flash(f'Email or password incorrect')
        return redirect('login')


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
def show_profile():
    """Show users profile"""
    pass


if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)
