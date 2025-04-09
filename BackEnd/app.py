from flask import Flask, request, jsonify, session
from flask_cors import CORS
from db import insert_user
from flask_bcrypt import Bcrypt
from main import general_search, get_token, get_auth_header
from sqlalchemy import create_engine, ForeignKey, Column, String, Integer, CHAR, MetaData, Table, DateTime, insert, text
from datetime import datetime
from dotenv import load_dotenv
import json
import os


load_dotenv()
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'


engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}", echo = True)
token = get_token()
app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app)

#If data is fetched from server URL + /search, this data is returned in json format.
@app.route('/search', methods = ['POST'])
def search():
    data = request.get_json()
    search_value = data.get("search", "")

    #In this example, "radiohead" is being searched as an artist returning 5 results
    return json.dumps(general_search(token, search_value, data.get("type", "artist"), 5))

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
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8') # not a safe method. dont do this
        
        # track session for proper content display, posting, tags, etc.
        
#<<<<<<< HEAD
        # Insert user into the database (you'll need to set this part up)
        
#=======
        # Insert user into the database (we'll need to set this part up)
#>>>>>>> a82af37f3ebd7d309788fa1edfffb76d0af0ca50
        # insert_user_into_db(email, username, hashed_password)
        with engine.connect() as conn:
            insert_user(conn, username, hashed_password, email)
        # If everything went well, return success message
        return jsonify({'message': 'User signed up successfully'}), 201

    except Exception as e:
        # Catch any exception and return a 500 error with the exception message
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    # need database for checking user data
    # Check if the user exists
    

    # Get the hashed password stored in the database


    # Check if the provided password matches the hashed one
    # if not check_password_hash(hashed_password, password):
    #     return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({"message": "Login successful!"}), 200

if __name__ == "__main__":
    app.run(debug=True)