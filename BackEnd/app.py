from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from main import general_search, get_token, get_auth_header, artist_search, track_search, album_search, id_search
from sqlalchemy import create_engine
from datetime import datetime
from db import insert_comment, insert_song, insert_user, select_user, check_user, get_song_posts, select_user_id, select_tags_song, insert_tag, check_tag, select_user_tags, select_user_comments, select_user_username
from sqlalchemy.exc import OperationalError, IntegrityError, SQLAlchemyError
from dotenv import load_dotenv
import time
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

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
string_format = "%b-%d-%y %I%p"

app.secret_key = "super-secret-stable-key"

# SESSION CONFIGS
app.config['SESSION_COOKIE_NAME'] = 'playback-session'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Or 'None' if using HTTPS
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME']


load_dotenv()
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'

engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}", echo = True)

#If data is fetched from server URL + /search, this data is returned in json format.
@app.route('/search', methods = ['POST'])
def search():
    token = get_token()
    data = request.get_json()
    search_value = data.get("search", "")
    return general_search(token, search_value, data.get("type", "artist"), 5)


@app.route('/broadsearch/<search>',methods = ["GET"])
def broad_search(search):
    token = get_token()
    search_value = search
    return jsonify({"artists" : general_search(token, search_value, "artist",10),

            "albums" : general_search(token, search_value, "album",10),
            "tracks" : general_search(token, search_value, "track",10),})


@app.route('/usertag',methods=["POST"])
def user_tag():
    try:
        data = request.get_json()
        song = data.get("songID")
        with engine.connect() as conn:
            if session["userID"]:
                result = check_tag(conn, song, session["userID"])
                return result
            else:
                return "None"
    except Exception as e:
        return jsonify({"error" : f"Error found:{e}"})

@app.route('/createtag',methods=["POST"])
def create_tag():
    try:
        data = request.get_json()
        song = data.get("songID")
        tag = data.get("tag")
        with engine.connect() as conn:
            if session["userID"]:
                insert_tag(conn, tag, song, session["userID"])
                return jsonify({"message" : "Tag Created Successfully"}), 200
            else:
                return jsonify({"message" : "Must be logged into to add tag."})
    except Exception as e:
        return jsonify({"error": f"Error with tag creation: {e}"}), 400
    


@app.route('/gettags', methods=["POST"])
def get_tags():
    try:
        print("TAG END HIT__________________________________")
        data = request.get_json()
        song = data.get("songID")
        with engine.connect() as conn:
            result = select_tags_song(conn, song)
            result.setdefault("exists", check_tag(conn, song, session["userID"]))
            return result
    except Exception as e:
        return f"Failed to fetch tags, error: {e}"
    

@app.route('/createpost', methods=['POST'])
def create_post():
    try :
        data = request.get_json()
        print(data)
        body = data.get("content")
        parent_comment = data.get("parent_comment")
        song = data.get("last_segment")
        if not body:
            return jsonify({'error': 'Please Enter Text'}), 400
        with engine.connect() as conn:
            insert_comment(conn, 1, song, body)
            return jsonify({"message" : "Comment Successfully Created"}), 200
            insert_comment(conn, session["userID"], song, body, parent_comment)
        return jsonify({"message" : "Successfully created comment"}), 200
    except Exception as e:
        # Catch any exception and return a 500 error with the exception message
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


# # @app.route("/getposts", methods=["POST"])
# # def get_posts():
# #     data = request.get_json()
# #     songID = data.get("last_segment")
# =======
@app.route("/getposts", methods=["POST"])
def get_posts():
    data = request.get_json()
    songID = data.get("last_segment")
    with engine.connect() as conn:
        results = get_song_posts(conn, songID)
        submit = [{"id" : item[0], "content" : item[1], "date" : item[2].strftime(string_format), "username" : select_user_id(conn,item[3]), "parent_comment" : item[5]} for item in results]
        return submit

@app.route('/usercommentactivity', methods=['GET'])
def user_comment_activity():
    try:
        username = session["username"]
        results_list = []
        with engine.connect() as conn:
            userID = select_user_username(conn,username)
            tag_list = select_user_tags(conn, userID)
            comment_list = select_user_comments(conn, userID)
            for tag in tag_list:
                results_list.append({"type" : "tag", "body" : tag[0], "song_data" : id_search(token, tag[1])})
            for comment in comment_list:
                results_list.append({"type" : "comment", "body" : comment[1], "date" : comment[2].strftime(string_format), "song_data" : id_search(token, comment[4])})
        print(results_list)
        return jsonify(results_list)
    except Exception as e:
        return e
    

@app.route('/usertagactivity', methods=['GET'])
def user_tag_activity():
    try:
        username = session["username"]
        results_list = []
        with engine.connect() as conn:
            userID = select_user_username(conn, username)
            tag_list = select_user_tags(conn, userID)
            for i in tag_list:
                results_list.append(i)
        return results_list
    except Exception as e:
        return []
            








# check to see if session is set
@app.route('/check-session', methods=['GET'])
def check_session():
    print("=================")
    print(session)
    if 'email' in session:
        print(f"Session data: {session}")
        return jsonify({"sessionSet": session["username"]})
    else:
        print(f"Session data: {session}")
        return jsonify({"sessionSet": ''}), 200
        
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
            result = insert_user(conn,username, hashed_password, email)
            session["userID"] = result
            session["username"] = username
            session["email"] = email
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
        session.permanent = True
        print(session)
        return jsonify({"message": "Login successful!"}), 200
    
    else:
        return jsonify({"error" : "Password or Email does not match"}), 404
    

@app.route('/artist/<id>', methods=['GET'])
def get_artist(id):
    token = get_token()
    if not id:
        return jsonify({'error': 'Artist ID is required'}), 400
    with engine.connect() as conn:
        insert_song(conn, id)
    return artist_search(token,id)

@app.route('/album/<id>', methods=['GET'])
def get_album(id):
    token = get_token()
    if not id:
        return jsonify({'error' : 'Album ID is required'}), 400
    with engine.connect() as conn:
        insert_song(conn, id)

    return album_search(token,id)
@app.route('/track/<id>', methods=['GET'])
def get_track(id):
    token = get_token()
    if not id:
        return jsonify({'error': 'Track ID is required'}), 400
    with engine.connect() as conn:
        insert_song(conn, id)
    return track_search(token,id)

if __name__ == "__main__":
    app.run(debug=True)