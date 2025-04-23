from dotenv import load_dotenv
import os
import base64
import json
from requests import post, get
import json

load_dotenv()
#Put the super secret data in the .env file that is grabbed here
client_id = os.getenv("CLIENT_ID")
client_secret = os.getenv("CLIENT_SECRET")

#generates token to be used by requests
def get_token():
    auth_string = client_id + ":" + client_secret
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")

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
    return {"Authorization": "Bearer " + token}

def general_search(token, search, type, limit):
    url = "https://api.spotify.com/v1/search"
    headers = get_auth_header(token)
    query = f"?q={search}&type={type}&limit={limit}"
    query_url = url + query
    result = get(query_url, headers=headers)
    json_result = json.loads(result.content).get(type + 's',{}).get("items",[])
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
    artist_data_url = f"https://api.spotify.com/v1/artists/{id}"
    artist_tracks_url = artist_data_url + "/top-tracks"
    headers = get_auth_header(token)
    artist_result = get(artist_data_url, headers=headers)
    track_result = get(artist_tracks_url, headers=headers)
    dataresult = json.loads(artist_result.content)
    trackresult = json.loads(track_result.content)
    results_list = {"artistname" : dataresult.get("name","NoName"),
                    "followers" : dataresult.get("followers", {}).get("total", 0),
                    "artistimage" : dataresult.get("images",[{"url" : "images/no_result.png"}])[0].get("url", ""),
                    "genres" : dataresult.get("genres",[]),
                    "toptracks" : [[item.get("name","NoName"),item.get("id","NoID"),item.get("album",{}).get("images",[{"url" : "images/no_result.png"}])[0].get("url", ""),item.get("album", {}).get("id", "NoAlbumID")] for item in trackresult.get("tracks",[])]
                    }
    
    return json.dumps(results_list)

def track_search(token, id):
    track_data_url = f"https://api.spotify.com/v1/tracks/{id}"
    headers = get_auth_header(token)
    track_result = get(track_data_url, headers=headers)
    result = json.loads(track_result.content)
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
    album_data_url = f"https://api.spotify.com/v1/albums/{id}"
    headers = get_auth_header(token)
    album_result = get(album_data_url, headers=headers)
    result = json.loads(album_result.content)
    results_list = {"albumname" : result.get("name", "NoName"),
                    "albumtype" : result.get("album_type", "NoAlbumType"),
                    "tracknumber" : result.get("total_tracks", 0),
                    "albumimage" : result.get("images", [{"url" : "images/no_result.png"}])[0].get("url", ""),
                    "albumreleasedate" : result.get("release_date","NoReleaseDate"),
                    "albumartists" : [[item.get("name","NoName"),item.get("id","NoID")] for item in result.get("artists",[])],
                    "albumtracks" : [[item.get("name","NoTrackName"),item.get("id","NoTrackID")]for item in result.get("tracks",[{}]).get("items",[])]
                    }
    return results_list

    


