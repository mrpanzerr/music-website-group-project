"""
Author: Ryan 
Date: 4.1.25  
Filename: main.py  

Purpose:  
This module provides functions for interacting with the Spotify Web API. It handles token authorization and allows searching for general media, as well as fetching detailed data on artists, tracks, and albums.  

System Context:  
Part of the Backend system for the PlayBack project. This script enables the frontend to retrieve clean and relevant music data from Spotify by processing raw API responses into structured JSON.  

Development History:  
- Written on: 4.1.25  
- Last revised on: 5.4.25 

Existence Rationale:  
Centralizes all Spotify-related API requests to ensure modularity and reuse of token handling, header generation, and data fetching logic across the backend system.  

Data Structures/ Algorithms:
- Uses dictionaries to structure API responses for artists, tracks, and albums. And simple iterations through groups 
of data.
Expected Input/Output:
- Input: Search queries, artist/track/album IDs. Output: JSON formatted data containing search results, artist details, track information, and album details.
Future Extensions or Revisions:  
As of 5.4.25 no more changes are necessary.
"""

from dotenv import load_dotenv
import os
import base64
import json
from requests import post, get
import json
from sqlalchemy import create_engine
from db import insertSong

load_dotenv() # Load environment variables from .env file
db_password = os.getenv("DB_PASSWORD")
db_user = 'root'
db_host = '127.0.0.1'
db_port = '3306'
db_name = 'play_back_db'

# Create a connection to the MySQL database using SQLAlchemy
engine = create_engine(f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}", echo = True)
# Secure client credentials for API access that are stored in .env files are grabbed here.
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")


# Purpose: Used to generate a token for API access
# Author: Ryan
# Date Written: 4.1.25
# Last Revised: 5.4.25
# Called By: Just about every function that needs to access the Spotify API
# System Context: Used to generate a key that is used in every spotify API request to authenticate the client.
# Data Structures: Various JSON structures are used to handle the response from the Spotify API.
# Algorithms Used: N/A
# Inputs: N/A
# Outputs: A token that can be used to query the Spotify API
# Future Changes: As of 5.4.25 no changes are necessary, but if the API changes or the authentication method changes, this function may need to be updated.
def get_token():
    try:
        # Encode client credentials for Basic Authentication
        auth_string = client_id + ":" + client_secret
        auth_bytes = auth_string.encode("utf-8")
        auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

        # Set the API URL for token request
        url = "https://accounts.spotify.com/api/token"
        headers = {
            "Authorization": "Basic " + auth_base64,
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {"grant_type": "client_credentials"}
        # Send POST request to get the token
        result = post(url, headers=headers, data=data)
        json_result = json.loads(result.content)
        # Check if the token was successfully retrieved
        token = json_result["access_token"]

        return token
    
    except Exception as e:

        print(f"Error getting token: {e}")

        return None

# Purpose: Creates an authorization header for API requests
# Author: Ryan
# Date Written: 4.1.25
# Last Revised: 5.4.25
# Called By: Any function that needs to make an API request
# System Context: Used to generate a simple authorization header that can be used in API requests to authenticate the client.
# Data Structures: A single JSON compatable dictionary is used to store the authorization header.
# Algorithms Used: N/A
# Inputs: API token as a string
# Outputs: Dictionary containing the authorization header
# Future Changes: As of 5.4.25 no changes are necessary, but if the API changes or the authentication method changes, this function may need to be updated.
def get_auth_header(token):
    try:

        return {"Authorization": "Bearer " + token}
    
    except Exception as e:

        print(f"Error getting auth header: {e}")

        return None

# Purpose: Used to return 5 results of a search query for artists, albums, or tracks.
# Author: Ryan
# Date Written: 4.1.25
# Last Revised: 5.4.25
# Called By: The broad search endpoint, and the search endpoint in the frontend.
# System Context: Used to show results of a query, contains spare information, mostly for searching
# Data Structures: A list of dictionaries is used to store the results of the search query.
# Algorithms Used: The API results are iterated through to retrieve the relevant information for each item.
# Inputs: API token, a search value, the type of media one if looking for, and the limit on the number of results.
# Outputs: A list of deictionaries containing relevant information about the media found in the search query.
# Future Changes: As of 5.4.25 no changes are necessary, but if the API changes or the search functionality changes, this function may need to be updated.
def general_search(token, search, type, limit):
    try:
        #Setting up the URL and headers for the API request
        url = "https://api.spotify.com/v1/search"
        headers = get_auth_header(token)
        query = f"?q={search}&type={type}&limit={limit}"
        query_url = url + query
        
        # Send GET request to the search endpoint
        result = get(query_url, headers=headers)
        # Parse the JSON response
        json_result = json.loads(result.content).get(type + 's',{}).get("items",[])
        
        # Check if any results are found
        if len(json_result) == 0:

            print("No results found")

            return None
        
        else:
            #Puts data found into a dictionary with Name:(artist/track/album), image: pic if it exists, and type: type of media
            results_list = [{"name": item.get("name", "NoName"),
                            "image" : item["images"][-1]["url"] if isinstance(item.get("images"), list) and item["images"] else "",
                            "type" : type,
                            "artist" : [artist.get("name", '') for artist in item.get("artists", [{}])],
                            "id" : item.get("id", ""),
                            "album" : item.get("album", {}).get("images",[{"url" : "images/no_result.png"}])[-1].get("url","")} for item in json_result]
            # Populates the database with songs that are found in the results
            with engine.connect() as conn:
                for i in results_list:
                    #Since a tracks data is stored differently by the API, its insertoin is handled differently
                    if i.get("type") == "track":
                        insertSong(conn, i.get("id"), i.get("name"), i.get("type"), i.get("album"))
                    else:
                        insertSong(conn, i.get("id"), i.get("name"), i.get("type"), i.get("image"))

            return results_list
        
    except Exception as e:

        print(f"Error in general_search: {e}")

        return None

    

# Purpose: Used to find detailed information about an artist, including their top tracks and genres.
# Author: Ryan
# Date Written: 4.1.25
# Last Revised: 5.4.25
# Called By: The artist search endpoint in the frontend.
# System Context: Used to display more specific information about an artist, including their top tracks and genres on the artist page.
# Data Structures: A dictionary with artist information, including a list of an artist's top tracks.
# Algorithms Used: API query results are iterated through and used to populate the result dictionary,
# Inputs: A token for API access and an artist ID to search for.
# Outputs: Dictionary containing artist information, including name, followers, image, genres, and top tracks.
# Future Changes: As of 5.4.25 no changes are necessary, but if the API changes or the artist search functionality changes, this function may need to be updated.
def artist_search(token, id):
    try:
        # Setting up the URL for the artist data and top tracks
        artist_data_url = f"https://api.spotify.com/v1/artists/{id}"
        artist_tracks_url = artist_data_url + "/top-tracks"
        headers = get_auth_header(token)
        artist_result = get(artist_data_url, headers=headers)
        track_result = get(artist_tracks_url, headers=headers)
        dataresult = json.loads(artist_result.content)
        trackresult = json.loads(track_result.content)
        
        # Process and format album data into a dictionary
        results_list = {"artistname" : dataresult.get("name","NoName"),
                        "followers" : dataresult.get("followers", {}).get("total", 0),
                        "artistimage" : dataresult.get("images",[{"url" : "images/no_result.png"}])[0].get("url", ""),
                        "genres" : dataresult.get("genres",[]),
                        #Iterates through top track results and adds relevant information to nested list.
                        "toptracks" : [[item.get("name","NoName"),item.get("id","NoID"),item.get("album",{}).get("images",[{"url" : "images/no_result.png"}])[0].get("url", ""),item.get("album", {}).get("id", "NoAlbumID")] for item in trackresult.get("tracks",[])]
                        }
        
        return results_list
    
    except Exception as e:

        print(f"Error in artist_search: {e}")

        return None


# Purpose: Searches for detailed information about a track, including its album and artists.
# Author: Ryan
# Date Written: 4.1.25
# Last Revised: 5.4.25
# Called By: The track search endpoint in the backend.
# System Context: Used to display detailed information about a track, including its album and artists on the track page.
# Data Structures: A dictionary containing track information, including track name, album type, album name, album ID, image URL, release date, and artists stored in a list.
# Algorithms Used: The artists are iterated through using a loop and list comprehension to create a list of artist names and IDs.
# Inputs: A token and track ID to search for.
# Outputs: Information on a track.
# Future Changes: 
def track_search(token, id):
    try:
        # Setting up the URL for the track data
        track_data_url = f"https://api.spotify.com/v1/tracks/{id}"
        headers = get_auth_header(token)
        track_result = get(track_data_url, headers=headers)
        result = json.loads(track_result.content)
        
        # Process and format album data into a dictionary
        results_list = {"trackname" : result.get("name", "NoName"),
                        "trackalbumtype" : result.get("album", {}).get("album_type", "NoAlbumType"),
                        "trackalbumname" : result.get("album", {}).get("name", "NoAlbumName"),
                        "trackalbumid" : result.get("album", {}).get("id", "NoAlbumID"),
                        "trackimage" : result.get("album", {}).get("images", [{"url" : "images/no_result.png"}])[0].get("url",""),
                        "trackreleasedate" : result.get("album", {}).get("release_date","NoRelaseDate"),
                        "trackartists" : [[item.get("name", "NoName"),item.get("id","NoID")] for item in result.get("artists",{})]
                        }
        
        return results_list
    
    except:

        print("Error in track_search")

        return None




# Purpose: Returns detailed information about an album, including its name, type, total tracks, image, release date, artists, and tracks.
# Author: Ryan
# Date Written: 4.1.25
# Last Revised: 5.4.25
# Called By: get_album endpoint in the backend.
# System Context: used to populat the album search page.
# Data Structures: A dictionary with album information, including album name, type, image URL, release date, an artists list, and a tracks list.
# Algorithms Used: List comprehension is used to create lists of artists and tracks from the API response via a for loop.
# Inputs: A album id and token to search for.
# Outputs: A dictionary containing album information, including album name, type, total tracks, image URL, release date, artists, and tracks.
# Future Changes: As of 5.4.25 no changes are necessary, but if the API changes or the album search functionality changes, this function may need to be updated.
def album_search(token, id):
    try:
        # Setting up the URL for the album data API query
        album_data_url = f"https://api.spotify.com/v1/albums/{id}"
        headers = get_auth_header(token)
        album_result = get(album_data_url, headers=headers)
        result = json.loads(album_result.content)
        
        # Process and format album data into a dictionary
        results_list = {"albumname" : result.get("name", "NoName"),
                        "albumtype" : result.get("album_type", "NoAlbumType"),
                        "tracknumber" : result.get("total_tracks", 0),
                        "albumimage" : result.get("images", [{"url" : "images/no_result.png"}])[0].get("url", ""),
                        "albumreleasedate" : result.get("release_date","NoReleaseDate"),
                        "albumartists" : [[item.get("name","NoName"),item.get("id","NoID")] for item in result.get("artists",[])],
                        "albumtracks" : [[item.get("name","NoTrackName"),item.get("id","NoTrackID")]for item in result.get("tracks",[{}]).get("items",[])]
                        }
        
        return results_list
    
    except Exception as e:  

        print(f"Error in album_search: {e}")

        return None

# Purpose: Used to search for artists, albums, and tracks based on a search value, uses the general search from above.
# Author: Ryan
# Date Written: 5.1.25
# Last Revised: 5.4.25
# Called By: The broad search endpoint in the backend.
# System Context: Used to help the user search for a value by returning a larger list of results that are relevant to the search value.
# Data Structures: A dictionary with three keys: artists, albums, and tracks, each containing a list of tuple search results.
# Algorithms Used: N
# Inputs: A token for API access and a search value to search for.
# Outputs: A JSON formatted string containing search 10 results for artists, albums, and tracks each.
# Future Changes: As of 5.4.25 no changes are necessary, but if the API changes or the search functionality changes, this function may need to be updated.
def broad_search(token,search_value):
    return json.dumps({"artists" : general_search(token, search_value, "artist",10),
            "albums" : general_search(token, search_value, "album",10),
            "tracks" : general_search(token, search_value, "track",10),})
    


if __name__ == "__main__":
    pass
    


