"""
Author: Ryan Ferrel  
Date: 4.1.25  
Filename: main.py  

Purpose:  
This module provides functions for interacting with the Spotify Web API. It handles token authorization and allows searching for general media, as well as fetching detailed data on artists, tracks, and albums.  

System Context:  
Part of the Backend system for the PlayBack project. This script enables the frontend to retrieve clean and relevant music data from Spotify by processing raw API responses into structured JSON.  

Development History:  
- Written on: 4.1.25  
- Last revised on: 4.12.25 

Existence Rationale:  
Centralizes all Spotify-related API requests to ensure modularity and reuse of token handling, header generation, and data fetching logic across the backend system.  

Future Extensions or Revisions:  
- Add pagination support to extend general search beyond 20 results.  
- Add error handling/logging to gracefully manage rate limits or malformed responses.  
- Add more Spotify endpoints as needed (e.g., playlists, saved tracks, etc).  
"""

from dotenv import load_dotenv
import os
import base64
import json
from requests import post, get
import json

load_dotenv() # Load environment variables from .env file

#Put the super secret data in the .env file that is grabbed here
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

def get_token():
    """
    Purpose:
        Requests and returns a Bearer token using client credentials from Spotify.

    Input:
        None (uses CLIENT_ID and CLIENT_SECRET from environment variables)

    Output:
        str: Access token used to authenticate API requests.
    """

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
    result = post(url, headers=headers, data=data)
    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    """
    Purpose:
        Builds a properly formatted Authorization header.

    Input:
        token (str): Bearer token from get_token()

    Output:
        dict: Authorization header
    """

    return {"Authorization": "Bearer " + token}

def general_search(token, search, type, limit):
    """
    Purpose:
        Performs a general search on Spotify (artists, albums, or tracks) using query string.

    Inputs:
        token (str): Bearer token
        search (str): Search keyword
        type (str): Spotify type ('artist', 'album', or 'track')
        limit (int): Max number of results to return

    Output:
        str: JSON-encoded list of simplified search results, or None if no results found.
    """

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
        return json.dumps(results_list)
    

def artist_search(token, id):
    """
    Purpose:
        Fetches artist profile data and top tracks from Spotify.

    Inputs:
        token (str): Bearer token
        id (str): Spotify artist ID

    Output:
        str: JSON-encoded dictionary with artist details and top tracks.
    """

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
                    "toptracks" : [[item.get("name","NoName"),item.get("id","NoID"),item.get("album",{}).get("images",[{"url" : "images/no_result.png"}])[0].get("url", ""),item.get("album", {}).get("id", "NoAlbumID")] for item in trackresult.get("tracks",[])]
                    }
    
    return json.dumps(results_list)

def track_search(token, id):
    """
    Purpose:
        Fetches track-specific metadata from Spotify.

    Inputs:
        token (str): Bearer token
        id (str): Spotify track ID

    Output:
        str: JSON-encoded dictionary with track details (album info, artists, etc).
    """

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
    return json.dumps(results_list)

def album_search(token, id):
    """
    Purpose:
        Fetches album metadata and tracklist from Spotify.

    Inputs:
        token (str): Bearer token
        id (str): Spotify album ID

    Output:
        dict: Python dictionary with album metadata and list of track names + IDs.
    """

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


