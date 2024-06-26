from flask import Flask, jsonify
from flask_cors import CORS
from openai import OpenAI
import lyricsgenius
import os
import random
from dotenv import load_dotenv
import requests

# Load environment variables from .env file
load_dotenv()

# Fetch API keys from environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
genius_api_key = os.getenv("GENIUS_API_KEY")

client_id = os.getenv("SPOTIFY_CLIENT_ID")
client_secret = os.getenv("SPOTIFY_CLIENT_SECRET")


auth_response = requests.post("https://accounts.spotify.com/api/token", {
    'grant_type': 'client_credentials',
    'client_id': client_id,
    'client_secret': client_secret,
})
auth_response_data = auth_response.json()
access_token = auth_response_data['access_token']

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=openai_api_key)

@app.route('/lyrics/<title>', methods=['GET'])
def get_lyrics(title):
    genius = lyricsgenius.Genius(genius_api_key)
    song = genius.search_song(title)
    return song.lyrics


def generate_first_prompt(title):
    lyrics = get_lyrics(title)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
            {"role": "user", "content": "Return only the most defining sentence from this set of lyrics : " + lyrics + ". Respond with only the sentence and no explanation."}
        ]
        )
    return response.choices[0].message.content


def generate_second_prompt(title):
    lyrics = get_lyrics(title)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-0125",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
            {"role": "user", "content": "What is the overall mood of these lyrics : " + lyrics + ". Respond with only the mood words and no explanation."}
        ]
        )
    return response.choices[0].message.content

@app.route('/image/<title>', methods=['GET'])
def get_image(title):
    lyrics = get_lyrics(title)
    response = client.images.generate(
    model="dall-e-3",
    prompt="Make an image, do not inlude any of the words, with these vibes + " + title + " + " + generate_first_prompt(title) + " + " + generate_second_prompt(title) + " include only one picture, and pictures only.",
    size="1024x1024",
    quality="standard",
    n=1,
    )
    image_url = response.data[0].url

    info = get_spotify(title)
    info["image"] = image_url
    return jsonify(info)
    
@app.route('/lucky', methods=['GET'])
def get_lucky():
    random_songs = {
        'Bohemian Rhapsody Queen': ('Bohemian_Rhap.png', 'Bohemian_Rhap2.png', 'Bohemian_Rhap3.png', 'Bohemian_Rhap4.png'),
        'Butter BTS': ('Butter.png', 'Butter2.png'),
        'Chammak Challo Akon': ('Chammak_Challo.png', 'Chammak_Challo2.png'),
        'Dancing Queen ABBA': 'Dancing_Queen.png',
        'Glamorous Fergie': 'Glamorous.png',
        'Hotline Bling Drake': 'Hotline_Bling.png',
        'Margaritaville Jimmy Buffet': ('Margaritaville.png', 'Margaritaville2.png'),
        'Money Pink Floyd': 'Money.png',
        'Stairway to Heaven Led Zeppelin': ('Stairway_to_Heaven.png', 'Stairway_to_Heaven2.png', 'Stairway_to_Heaven3.png'),
        'Stayin Alive Bee Gees': ('Stayin_Alive.png', 'Stayin_Alive2.png'),
        'Summertime Sadness Lana Del Rey': ('Summertime_Sadness.png', 'Summertime_Sadness2.png'),
        'Umbrella Rihanna': 'Umbrella.png',
        'Viva La Vida Coldplay': 'Viva_La_Vida.png',
        'Watermelon Sugar Harry Styles': 'Watermelon_Sugar.png',
        'You Belong With Me Taylor Swift': ('You_Belong_With_Me.png', 'You_Belong_With_Me2.png', 'You_Belong_With_Me3.png'),
    }

    random_song = random.choice(list(random_songs.keys()))
    random_path = random_songs[random_song]

    if isinstance(random_path, tuple):
        random_path = random.choice(random_path)

    # get path
    image_path = './images/' + random_path

    info = get_spotify(random_song)
    info["image"] = image_path

    return jsonify(info)

@app.route('/spotify/<title>', methods=['GET'])
def get_spotify(title):
    
    song_response = requests.get("https://api.spotify.com/v1/search", {
        'q': title,
        'type': 'track',
        'limit': 1
    }, headers={
        'Authorization': 'Bearer ' + access_token
    })

    song_response_data = song_response.json()


    if song_response_data['tracks']['items']:
        track = song_response_data['tracks']['items'][0]
        track_name = track['name']
        artist_name = track['artists'][0]['name']
        preview_url = track.get('preview_url', 'No preview available')

        return {
            "name": track_name,
            "artist": artist_name,
            "url": preview_url
        }
    else:
        return {"error": "No track found"}

if __name__ == "__main__":
    app.run(debug="True", port=8080)