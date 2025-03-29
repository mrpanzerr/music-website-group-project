from flask import Flask ,request, jsonify
from flask_cors import CORS
from main import general_search, get_token, get_auth_header
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

token = get_token()
app = Flask(__name__)
CORS(app)

#If data is fetched from server URL + /search, this data is returned in json format.
@app.route('/search', methods = ['POST'])
def search():
    data = request.get_json()
    search_value = data.get("search", "")

    #In this example, "radiohead" is being searched as an artist returning 5 results
    return json.dumps(general_search(token, search_value, data.get("type", "artist"), 5))


if __name__ == "__main__":
    app.run(debug=True)