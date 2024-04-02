from flask import Flask, jsonify
from flask_cors import CORS
from openai import OpenAI
import lyricsgenius
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch API keys from environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
genius_api_key = os.getenv("GENIUS_API_KEY")

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=openai_api_key)

@app.route('/lyrics/<title>', methods=['GET'])
def get_lyrics(title):
    genius = lyricsgenius.Genius(genius_api_key)
    song = genius.search_song(title)
    return jsonify({
            "lyrics": song.lyrics
    })

@app.route('/image', methods=['GET'])
def get_image():
    response = client.images.generate(
    model="dall-e-3",
    prompt="a sea otter with a pearl earring",
    size="1024x1024",
    quality="standard",
    n=1,
    )
    image_url = response.data[0].url
    return jsonify({
        "image": image_url
    })
    
if __name__ == "__main__":
    app.run(debug="True", port=8080)