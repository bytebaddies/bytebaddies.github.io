from flask import Flask, jsonify
from flask_cors import CORS
from openai import OpenAI
import lyricsgenius


app = Flask(__name__)
CORS(app)

client = OpenAI(api_key="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")

@app.route('/lyrics/<title>', methods=['GET'])
def get_lyrics(title):
    genius = lyricsgenius.Genius("UKqAiMpW9BGFlLf2Ohk0htI6tPRlwoQvdoe5t_w69bR98_Ik0gK7kaIbliFbbDFI")
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