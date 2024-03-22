from flask import Flask, jsonify
from flask_cors import CORS
import lyricsgenius



app = Flask(__name__)
CORS(app)

@app.route('/lyrics/<title>/<artist>', methods=['GET'])
def get_lyrics(title, artist):
    genius = lyricsgenius.Genius("UKqAiMpW9BGFlLf2Ohk0htI6tPRlwoQvdoe5t_w69bR98_Ik0gK7kaIbliFbbDFI")
    song = genius.search_song(title, artist)
    return jsonify({
            "lyrics": song.lyrics
    })
    
if __name__ == "__main__":
    app.run(debug="True", port=8080)