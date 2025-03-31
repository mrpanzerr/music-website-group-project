from dotenv import load_dotenv
import os
import base64
import json
from requests import post, get

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
        return results_list
    
token = get_token()
print(general_search(token,"ara", "track", 1))
    


