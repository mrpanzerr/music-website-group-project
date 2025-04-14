from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from main import general_search, get_token, get_auth_header, artist_search, track_search, album_search
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json
import requests

token = get_token()
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

# Define User model for entering into database - needs to be updtaed to be consistent with database
"""class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False) """


#If data is fetched from server URL + /search, this data is returned in json format.
@app.route('/search', methods = ['POST'])
def search():
    data = request.get_json()
    search_value = data.get("search", "")

    #In this example, "radiohead" is being searched as an artist returning 5 results
    return general_search(token, search_value, data.get("type", "artist"), 5)

@app.route('/signup', methods=['POST'])
def signup():
    try :
        # Get the JSON data from the request
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
        
        """
        # Check if user already exists 
        existing_user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({"error": "Email not found"}), 401

        # Check if the password matches
        if not bcrypt.check_password_hash(user.password, password):
            return jsonify({"error": "Incorrect password"}), 401
        
        # Create a new user and add to the database
        new_user = User(email=email, username=username, password=hashed_password)
        db.session.add(new_user)
        db.session.commit() 
        """
        
        # If everything went well, return success message
        return jsonify({'message': 'User signed up successfully'}), 201
        
        # Insert user into the database (we'll need to set this part up)
#>>>>>>> a82af37f3ebd7d309788fa1edfffb76d0af0ca50
        # insert_user_into_db(email, username, hashed_password)

    except Exception as e:
        # Catch any exception and return a 500 error with the exception message
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400
       
    """
    user = User.query.filter_by(email=email).first()
    
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password}), 401
 
    # Check if the provided password matches the hashed one
    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401
        
    """

    return jsonify({"message": "Login successful!"}), 200

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
        # headers = get_auth_header(token)
        # url = f"https://api.spotify.com/v1/artists/{id}"
        # response = requests.get(url, headers=headers)

        # if response.status_code == 200:
        #     try:
        #         data = response.json()  # Parse the JSON response
                
        #         # Check if 'name', 'id', and 'popularity' are returned
        #         artist_name = data.get('name', 'Unknown')
        #         artist_id = data.get('id', 'Unknown')
        #         artist_genres = data.get('genres', [])
        #         artist_popularity = data.get('popularity', 'Unknown')

        #         # Handle empty genres array
        #         if not artist_genres:
        #             artist_genres = ['No genres available']

        #         # Format the artist info to return
        #         artist_info = {
        #             "name": artist_name,
        #             "id": artist_id,
        #             "genres": artist_genres,
        #             "popularity": artist_popularity
        #         }

        #         return jsonify(artist_info)

    #         except ValueError:
    #             return jsonify({'error': 'Invalid JSON response from Spotify'}), 500
    #     elif response.status_code == 404:
    #         return jsonify({'error': 'Artist not found'}), 404
    #     else:
    #         return jsonify({'error': f'Error fetching artist data. Status code: {response.status_code}'}), 500
    # except Exception as e:
    #     return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)