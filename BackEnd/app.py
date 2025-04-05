from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from main import general_search, get_token, get_auth_header
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

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
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        
        # track session for proper content display, posting, tags, etc.
        
        # Insert user into the database (you'll need to set this part up)
        # insert_user_into_db(email, username, hashed_password)

        # If everything went well, return success message
        return jsonify({'message': 'User signed up successfully'}), 201

    except Exception as e:
        # Catch any exception and return a 500 error with the exception message
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

if __name__ == "__main__":
    app.run(debug=True)