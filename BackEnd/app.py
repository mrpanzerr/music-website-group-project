#Author: Ryan, Gaetano
#Date 5.4.2025
#Filename: app.py
#Purpose: The functions in this file are endpoints that can be accessed by the frontend. Once a front
#end component makes a request, the functions are activated and can perform a variety of tasks, such as 
#the retreival/alteration of data from the database, or interating with the Spotify API to fetch data. 
#While not all the time, the requests made by the front end will can be met with a response which is 
#formatted by these functions.
#Where it fits in the system: This file is the main entry point for the backend of the PlayBack application.
#Any dynamic component on the front end will go through app.py at least once.
#When the class was written and revised: First written on 3.10.25, revised on 5.4.25.
#Why the file exists: This file is the main entry point for the backend of the PlayBack application.
#How it uses its data structures and algorithms: Lists and dictionaries are primarily used to store and
#manipulate data before it is sent to the front end. Most of the algorithms are simple and involve iterating
#through objects provided by the frontend, the database, or the Spotify API.
#Expected input: The expected input is a request from the front end, which can include data such as user credentials,
#song information, or search queries.
#Expected output: The expected output is a JSON response that contains the requested data or a success/error message.
#Expected extensions or revisions: As of right now (5.4.25), there are no expected extensions or revisions.

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from main import general_search, get_token, artist_search, track_search, album_search
from sqlalchemy import create_engine
from datetime import datetime
from db import insertComment, insertSong, insertUser, selectUserFromEmail, checkUserExistence, selectTagsFromSong, selectUserFromID, selectTagsFromSong, insertTag, selectUsersTag, selectUsersTags, selectUsersComments, selectUserIDFromUsername, selectSong, deleteComment, selectPostsFromSong
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv
import os

#Credentials for the MySQL database which will be used in the database connection string below
load_dotenv()
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'

#Creates an engine that connects to the MySQL database using SQLAlchemy. Used to manipulate database.
engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}")

#Creates a Flask application instance, which is the main entry point for the backend of the PlayBack application.
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)
#Set the date format for displaying dates in comments and posts.
string_format = "%b-%d-%y %I%p"
#Secret key for the Flask application, used for session management.
app.secret_key = "super-secret-stable-key"

#Session configs, control how session work in the backend
app.config['SESSION_COOKIE_NAME'] = 'playback-session'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME']


# Purpose: To return a list of 5 search results based on the search value and type in the request.
# Author: Ryan 
# Date Written: 3.10.25
# Last Revised: 4.5.25
# Called By: The front end search bar component on the homepage (searchbar.tsx).
# System Context: Supplies the user will a small list that dynamically updates as the user types in the search bar.
# Data Structures: The search inputs are in a JSON format, and the results are returned as a JSON object.
# Algorithms Used: N/A
# Inputs: Search value and type (artist, album, or track) from the request body.
# Outputs: A list of data from the Spotify API about the five most relevant search results based on the search value and type.
# Future Changes: As of 4.5.25, there are no expected changes to this function. It is working as intended.
@app.route('/search', methods = ['POST'])
def search():
    print("SEARCH ENDPOINT HIT")

    try:
        #Generates an API token and gets the search value and type from the request body.
        token = get_token()
        data = request.get_json()
        search_value = data.get("search", "")
        result = general_search(token, search_value, data.get("type", "artist"), 5)

        return result
    
    except Exception as e:

        return jsonify({"error": f"Error while searching found: {e}"}), 500


# Purpose: To find the 10 most relevant results of the three different types, artist, album, and track, based on the search value provided in the request.
# Author: Ryan  
# Date Written: 5.1.25
# Last Revised: 5.5.25
# Called By: Broad search bar component on the homepage (BroadSearch.jsx).
# System Context: If the user is having trouble finding what they are looking for when using the search bar,
# they can use the broad search bar to find more results.
# Data Structures: Stores the search value in a string and returns the results in a dictionary with three keys.
# with values that are lists of data from the Spotify API.
# Algorithms Used: N/A
# Inputs: A search value from the front end.
# Outputs: Three lists of 10 results of each type of media from the Spotify API, artist, album, and track.
# Future Changes: As of 5.5.25, there are no expected changes to this function. It is working as intended.
@app.route('/broadsearch/<search>',methods = ["GET"])
def broad_search(search):
    print("BROAD SEARCH ENDPOINT HIT")

    try:
        #Generates an API token and gets the search value from the request.
        token = get_token()
        search_value = search

        return jsonify({

                "artists" : general_search(token, search_value, "artist",10),
                "albums" : general_search(token, search_value, "album",10),
                "tracks" : general_search(token, search_value, "track",10),})
    
    except Exception as e:

        return jsonify({"error" : f"Error while broad searching found: {e}"}), 500


# Purpose: Creates a database entry for a new tag associated with a song.
# Author: Ryan
# Date Written: 4.20.25
# Last Revised: 5.4.25
# Called By: The tag creation component that is part of the pagetemplate component(tags.jsx).
# System Context: Stores tags in the database that are associated with a song and a user.
# Data Structures: JSON data structure is being recieved by request and sent in response.
# Algorithms Used: N/A
# Inputs: A tag value and a song ID from the request and a user ID from the session.
# Outputs: JSON response indicating success or failure of the tag creation.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/createtag',methods=["POST"])
def create_tag():
    print("CREATE TAG ENDPOINT HIT")

    try:
        #Gets the tag value and song ID from the request body.
        data = request.get_json()
        song = data.get("songID")
        tag = data.get("tag")
        with engine.connect() as conn:

            if session["userID"]:
                #Checks if the tag already exists for the song and user, if not, inserts the new tag into the database.
                insertTag(conn, tag, song, session["userID"])

                return jsonify({"message" : "Tag Created Successfully"}), 200
            
            else:

                return jsonify({"message" : "Must be logged into to add tag."})
            
    except Exception as e:

        return jsonify({"error": f"Error with tag creation: {e}"}), 400
    

# Purpose: Gets the tag data associated with a song from the data base and returns in a JSON format.
# Author: Ryan  
# Date Written: 4.20.25
# Last Revised: 5.4.25
# Called By: The tags component that is part of the pagetemplate component(tags.jsx).
# System Context: Fills out the numbers that are below the tags on the media pages to show totals. Also gets the users current tag associated with the song.
# Data Structures: JSON data structure is being recieved by request and sent in response.
# Algorithms Used: N/A
# Inputs: A song ID from the request and a user ID from the session.
# Outputs: A JSON response that has the tag sum data from the database and the users current tag.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/gettags', methods=["POST"])
def get_tags():
    print("GET TAGS ENDPOINT HIT")

    try:
        #Gets the song ID from the request body.
        data = request.get_json()
        song = data.get("songID")
        with engine.connect() as conn:
            #Not only gets the tag data, but also gets the tag associated with the user so they can see what tag they have with this song
            result = selectTagsFromSong(conn, song)
            result.setdefault("exists", selectUsersTag(conn, song, session["userID"]))

            return result
        
    except Exception as e:

        return {"error": f"Error with tag retrieval: {e}"}, 500
    

# Purpose: Where new comments are added to the database.
# Author: Ryan
# Date Written: 4.25.25
# Last Revised: 5.4.25
# Called By: The comment_form.jsx component that is used in the pagetemplate component.
# System Context: Allows the user to create a comment that will be shown under a piece of media's page
# Data Structures: JSON data structure is being recieved by request and sent in response.
# Algorithms Used: N/A
# Inputs: A comment body, a parent comment ID (if it is a reply), and a song ID from the request body.
# Outputs: A message indicating the success or failure of the comment creation.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/createpost', methods=['POST'])
def create_post():
    print("CREATE POST ENDPOINT HIT")

    try :
        # Get the JSON data from the request
        data = request.get_json()
        body = data.get("content")
        parent_comment = data.get("parent_comment")
        song = data.get("last_segment")
        # Check if the body is empty
        if not body:

            return jsonify({'error': 'Please Enter Text'}), 400
        
        with engine.connect() as conn:
            insertComment(conn, session["userID"], song, body, parent_comment)

            return jsonify({"message" : "Comment Successfully Created"}), 200
        
    except Exception as e:
        # Catch any exception and return a 500 error with the exception message
        return jsonify({'error': f'Internal server error: {str(e)}'}), 400
    

# Purpose: If a user wants to delete a post from the frontend, this is is the method that will be called.
# Author: Ryan
# Date Written: 5.2.25
# Last Revised: 5.4.25
# Called By: The comment_form.jsx component that is used in the pagetemplate component.
# System Context: A button is available to delete a comment that the user has made on a piece of media,
# if they press it, the posts data is sent here and the comment is deleted from the database.
# Data Structures: JSON data structure is being recieved by request and sent in response.
# Algorithms Used: N/A
# Inputs: A comment ID from the request body and a user ID from the session.
# Outputs: A message indicating the success or failure of the comment deletion.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route("/deletepost", methods=["POST"])
def deletepost():
    print("DELETE POST ENDPOINT HIT")

    try:
        # Get the comment id from the request
        data= request.get_json()
        userID = session.get("userID")
        commentID = data.get("id")
        with engine.connect() as conn:

            deleteComment(conn, commentID, userID)

        return jsonify({"message" : "Comment Deleted Successfully"}), 200
    
    except Exception as e:

        return jsonify({"error" : f"Error deleting comment: {e}"}), 400


# Purpose: Used to get all the posts associated with a song, and return them to the front end only if a user has commented.
# Author: Ryan
# Date Written: 4.25.25
# Last Revised: 5.4.25
# Called By: The comment_form.jsx component that is used in the pagetemplate component.
# System Context: Responsible for retrieving all the comments associated with a song and returning them to the front end.
# Data Structures: JSON data structure is being recieved by request and sent in response. An intermediary
# list is used to store the posts before they are returned.
# Algorithms Used: A simple for loop is used to iterate through the results and format them into a list of dictionaries.
# Inputs: A songID and from the request body.
# Outputs: A JSON response containing the posts associated with the song, along with a boolean indicating if the user has commented.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route("/getposts", methods=["POST"])
def get_posts():
    print("GET POSTS ENDPOINT HIT")

    try:

        data = request.get_json()
        songID = data.get("last_segment")
        #Value that will track if user has commented on the song
        user_in = False
        with engine.connect() as conn:
            #This function will return all the posts associated with a song in an iterable.
            results = selectPostsFromSong(conn, songID)
            submit = []
            #Loops through the results and formats them into a list of dictionaries.
            for item in results:
                submit.append({
                    "id" : item[0],
                    "content" : item[1],
                    "date" : item[2].strftime(string_format),
                    "username" : selectUserFromID(conn,item[3]),
                    "parent_comment" : item[5]})
                #Checks if the user has commented on the song, if they have, user_in is set to True.
                if selectUserFromID(conn,item[3]) == session.get("username"):
                    user_in = True
        #If the user has commented, the function will return a JSON response with the posts and a boolean indicating that the user has commented.
        if user_in:

            return {"posted" : True , "data" : submit}, 200
        #If not the data will be returned with a boolean indicating that the user has not commented.
        else:

            return {"posted" : False , "data" : []}, 200
        
    except Exception as e:

        return jsonify({"error": f"Error fetching posts: {e}"}), 500


# Purpose: Fetches user comment activity including comments and tags associated with a user.
# Author: Ryan
# Date Written: 5.2.25  
# Last Revised: 5.4.25
# Called By: The UserPage.jsx component
# System Context: Allows the user to see their comment activity on the platform, including comments and tags they have created.
# Data Structures: Returns a json, which is a dictionary with two keys, "tags" and "comments". Each key has a list of dictionaries as its value.
# Algorithms Used: Basic iteration through tags and comments objects from sqlalchemy medthods.
# Inputs: A username from the URL.
# Outputs: A JSON response containing the user's comment activity, including tags and comments.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/useractivity/<user>', methods=['GET'])
def user_comment_activity(user):
    print("USER ACTIVITY ENDPOINT HIT")

    try:
        #gets the username from the URL
        username = user
        with engine.connect() as conn:
            #Gets the userID from the username
            userID = selectUserIDFromUsername(conn, username)
            #User comments and tags stored in iterables
            comments_list = selectUsersComments(conn, userID)
            tags_list = selectUsersTags(conn, userID)
            #Uses list comprehensions to format the comments and tags into a dictionary that can be returned to the front end.
            #Admittably, this is a bit of a hacky way to do it, but its more easier to understand this way.
            results_dict = {"tags": [{
                                    "vibe" : tag[0],
                                    "songid" : tag[1],
                                    "song_name" : selectSong(conn, tag[1])[1],
                                    "song_url" : selectSong(conn, tag[1])[2],
                                    "type" : selectSong(conn, tag[1])[3]}for tag in tags_list],
                            "comments": [{
                                    "content" : comment[1], 
                                    "date" : comment[2].strftime(string_format),
                                    "songid" : comment[4],
                                    "song_name" : selectSong(conn, comment[4])[1],
                                    "song_url" : selectSong(conn, comment[4])[2],
                                    "type" : selectSong(conn,comment[4])[2]} for comment in comments_list]}
            
            return results_dict
        
    except Exception as e:

        return jsonify({"error": f"Error fetching user comment activity: {e}"}), 500

    
# Purpose: Checks to see if the users session is set, and returns the username if it is.
# Author: Gaetano
# Date Written: 4.28.25
# Last Revised: 5.4.25
# Called By: A variety of components that need to check if the user is logged in, such as the nav bar and comment and tags components.
# System Context: Used for checking if a user is logged in.
# Data Structures: Session iterable, structured as a dictionary, is used to store user information. Sends messages in JSON format with username if session is set.
# Algorithms Used: N/A
# Inputs: N/A
# Outputs: JSON message with username if session is set, or an empty string if not.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/check-session', methods=['GET'])
def check_session():
    print("CHECK SESSION ENDPOINT HIT")
    
    try:
        # Check if the session has a username set, if it does, the session is likely filled out and active.
        if 'email' in session:
            # Borth username and email are set in the session, so we can return the username.
            print(session)
            
            return jsonify({"sessionSet": session["username"]}), 200
        
        else:

            return jsonify({"sessionSet": ''}), 200
        
    except Exception as e:

        return jsonify({"error": f"Internal server error{e}"}), 500
            

# Purpose: Clears the session data, effectively logging the user out.
# Author: Gaetano
# Date Written: 4.28.25
# Last Revised: 5.4.25
# Called By: The navbar component when the user clicks the logout button.
# System Context: Clears the session data, logging the user out of the application.
# Data Structures: Response is in JSON form
# Algorithms Used: N/A
# Inputs: N/A
# Outputs: Message indicating successful logout or an error message if something goes wrong.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/logout', methods=['POST'])
def logout():
    print("LOGOUT ENDPOINT HIT")

    try:
        # Clear the session data
        session.clear()

        return jsonify({'message': 'Logged out successfully'}), 200
    
    except Exception as e:

        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


# Purpose: Creates a new user account by inserting the user's information into the database.
# Author: Gaetano, Ryan
# Date Written: 4.20.25
# Last Revised: 5.4.25
# Called By: Signup component on the homepage (create_acct.tsx).
# System Context: Allows a new account to be created by inserting the user's information into the database.
# Data Structures: JSON data structure is being recieved by request and sent in response.
# Algorithms Used: N/A
# Inputs: email, username, and password from the request body.
# Outputs: A message indicating success or failure of the signup process, along with a status code.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/signup', methods=['POST'])
def signup():
    print("SIGNUP ENDPOINT HIT")

    try :

        # Get the JSON data from the request
        data = request.get_json()
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')

        # Check if any of the required fields are missing
        if not email or not username or not password:
            return jsonify({'error': 'All fields are required'}), 400

        # Basic email format validation
        if '@' not in email:
            return jsonify({'error': 'Invalid email format'}), 400

        with engine.connect() as conn:
            # Checks if the username already exists in the database
            email_check = selectUserFromEmail(conn,email)

            if email_check:
                return jsonify({'error': 'Email already exists'}), 409

        # Hash the password using bcrypt
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
 
        with engine.connect() as conn:
            #Insertion of the new user into the database happens here
            result = insertUser(conn, username, hashed_password, email)
            session["userID"] = result
            session["username"] = username
            session["email"] = email

        return jsonify({'message': 'User signed up successfully'}), 201
        
    except IntegrityError as e:
        #Handle integrity error, such as duplicate username or email and displays it in error message
        with engine.connect() as conn:
            user_status = checkUserExistence(conn, username, email)
        return jsonify({'error': user_status}), 500


# Purpose: Allows the user to login by checking their credentials against the database.
# Author: Ryan 
# Date Written: 4.28.25 
# Last Revised: 5.4.25
# Called By: The login component on the homepage (login.tsx).
# System Context: Allows the user to login and create a session
# Data Structures: JSON data structure is being recieved by request and sent in response.
# Algorithms Used: N/A
# Inputs: An email and password from the request body.
# Outputs: A message indicating success or failure of the login process, along with a status code.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/login', methods=['POST'])
def login():
    print("LOGIN ENDPOINT HIT")

    try:
        # Get the JSON data from the request
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        # Check if email and password are provided
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        # Check if the email exists in the database
        with engine.connect() as conn:
            result = selectUserFromEmail(conn, email)
        # To verify that the user exists, the hashed password and password provided by the request are compared
        if result != None and bcrypt.check_password_hash(result[2], password):
            # If the credentials are valid, set the session data
            session['userID'] = result[0]
            session['username'] = result[1]
            session['email'] = result[3]
            session.permanent = True

            return jsonify({"message": "Login successful!"}), 200
        
        else:
            # If the credentials are invalid, return an error message
            return jsonify({"error" : "Password or Email does not match"}), 404
        
    except Exception as e:

        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    

# Purpose: Gets the artist data from the Spotify API based on the artist ID provided in the URL, used for filling out artist pages.
# Author: Gaetano
# Date Written: 4.10.25
# Last Revised: 5.4.25
# Called By: The artist page component (ArtistPage.jsx).
# System Context: Fills out the artist pages with data on the song being searched.
# Data Structures: JSON data structure is being sent in the response.
# Algorithms Used: N/A
# Inputs: A song ID from the URL.
# Outputs: A JSON reponse with data on the artist, including their name, genres, popularity, and images.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/artist/<id>', methods=['GET'])
def get_artist(id):
    print("GET ARTIST ENDPOINT HIT")

    try:
        
        token = get_token()

        if not id:

            return jsonify({'error': 'Artist ID is required'}), 400
        #Uses artist search from main.py to get the artist data from the Spotify API.
        return artist_search(token,id)
    
    except Exception as e:

        return jsonify({'error': f'Error fetching artist data: {str(e)}'}), 500


# Purpose: Used to fill out album pages with data on the album being searched.
# Author: Ryan
# Date Written: 4.15.25
# Last Revised: 5.4.25
# Called By: The album page component (AlbumPage.jsx).
# System Context: Used for sending album data to the front end to fill out the album page.
# Data Structures: JSON response with album data.
# Algorithms Used: N/A
# Inputs: Album ID from the URL.
# Outputs: JSON response with album data including name, artists, release date, and images.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/album/<id>', methods=['GET'])
def get_album(id):
    print("GET ALBUM ENDPOINT HIT")

    try:
        
        token = get_token()

        if not id:

            return jsonify({'error' : 'Album ID is required'}), 400
        #uses album search from main.py to get the album data from the Spotify API.
        return album_search(token,id)
    
    except Exception as e:

        return jsonify({'error': f'Error fetching album data: {str(e)}'}), 500


# Purpose: Used to fill out track pages with data on the track being searched.
# Author: Ryan
# Date Written: 4.15.25
# Last Revised: 5.4.25
# Called By: The page component for tracks (TrackPage.jsx).
# System Context: Calls the Spotify API to get track data based on the track ID provided in the URL.
# Data Structures: JSON response with track data.
# Algorithms Used: N/A
# Inputs: Track ID from the URL.
# Outputs: Track data in JSON format, including name, artists, album, duration, and images.
# Future Changes: As of 5.4.25, there are no expected changes to this function. It is working as intended.
@app.route('/track/<id>', methods=['GET'])
def get_track(id):
    print("GET TRACK ENDPOINT HIT")

    try:

        token = get_token()

        if not id:

            return jsonify({'error': 'Track ID is required'}), 400
        #Calls track search from main.py to get the track data from the Spotify API.
        return track_search(token,id)
    
    except Exception as e:

        return jsonify({'error': f'Error fetching track data: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)
