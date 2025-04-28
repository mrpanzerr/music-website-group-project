from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from main import general_search, get_token, get_auth_header, artist_search, track_search, album_search
from sqlalchemy import create_engine
from datetime import datetime
from db import insert_comment, insert_song, insert_user, select_user, check_user, get_posts
from sqlalchemy.exc import OperationalError, IntegrityError, SQLAlchemyError
from dotenv import load_dotenv
import os
import json
import requests


load_dotenv()
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'

# Create a connection to the MySQL database using SQLAlchemy
engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}", echo = True)



token = get_token()
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)

app.secret_key = "super-secret-stable-key"

# SESSION CONFIGS
app.config['SESSION_COOKIE_NAME'] = 'playback-session'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Or 'None' if using HTTPS
app.config['SESSION_COOKIE_SECURE'] = True


#If data is fetched from server URL + /search, this data is returned in json format.
@app.route('/search', methods = ['POST'])
def search():
    data = request.get_json()
    search_value = data.get("search", "")

    #In this example, "radiohead" is being searched as an artist returning 5 results
    return general_search(token, search_value, data.get("type", "artist"), 5)



@app.route('/createpost', methods=['POST'])
def create_post():
    data = request.get_json()
    try :
        data = request.get_json()
        body = data.get("content")
        song = data.get("last_segment")
        if not body:
            return jsonify({'error': 'Please Enter Text'}), 400
        with engine.connect() as conn:
            insert_comment(conn, 1, song, body)
            return jsonify({"message" : "Comment Successfully Created"}), 200
    except Exception as e:
        # Catch any exception and return a 500 error with the exception message
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@app.route("/getposts", methods=["POST"])
def get_posts():
    data = request.get_json()
    songID = data.get("last_segment")
    with engine.connect() as conn:
        comment_list = get_posts(conn, songID)
    print(json.dumps(comment_list))






# check to see if session is set
@app.route('/check-session', methods=['GET'])
def check_session():
    print("=================")
    print(session)
    if 'email' in session:
        print(f"Session data: {session}")
        return jsonify({"sessionSet": True})
    else:
        print(f"Session data: {session}")
        return jsonify({"sessionSet": False}), 200
        
# Log user out and close session
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    print(f"Session data: {session}")
    return jsonify({'message': 'Logged out successfully'}), 200


@app.route('/signup', methods=['POST'])
def signup():
    try :
        # Get the JSON data from the request
        print("Signup route hit")
        data = request.get_json()

        # Extract the email, username, and password
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        # Check if any of the required fields are missing
        if not email or not username or not password:
            return jsonify({'error': 'All fields are required'}), 400

        # Basic email format validation
        if '@' not in email:
            return jsonify({'error': 'Invalid email format'}), 400

        # Hash the password using bcrypt
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
 
        with engine.connect() as conn:
            insert_user(conn,username, hashed_password, email,)
        return jsonify({'message': 'User signed up successfully'}), 201
        
    except IntegrityError as e:
        print(e)
        with engine.connect() as conn:
            user_status = check_user(conn, username, email)
        # Catch any exception and return a 500 error with the exception message
        return jsonify({'error': user_status}), 500


@app.route('/login', methods=['POST'])
def login():


    data = request.get_json()
    email = data.get('email')
    password = data.get('password')


    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
      

    with engine.connect() as conn:
        result = select_user(conn, email)

    if result != None and bcrypt.check_password_hash(result[2], password):
        session['userID'] = result[0]
        session['username'] = result[1]
        session['email'] = result[3]
        print(session)
        return jsonify({"message": "Login successful!"}), 200
    
    else:
        return jsonify({"error" : "Password or Email does not match"}), 404
    

@app.route('/artist/<id>', methods=['GET'])
def get_artist(id):
    if not id:
        return jsonify({'error': 'Artist ID is required'}), 400

    return artist_search(token,id)

@app.route('/album/<id>', methods=['GET'])
def get_album(id):
    if not id:
        return jsonify({'error' : 'Album ID is required'}), 400

    return album_search(token,id)
@app.route('/track/<id>', methods=['GET'])
def get_track(id):
    if not id:
        return jsonify({'error': 'Track ID is required'}), 400

    return track_search(token,id)

if __name__ == "__main__":
    app.run(debug=True)