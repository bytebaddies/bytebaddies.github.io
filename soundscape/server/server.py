from flask import Flask, jsonify
from flask_cors import CORS
from openai import OpenAI
import lyricsgenius
import os
import random
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Fetch API keys from environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
genius_api_key = os.getenv("GENIUS_API_KEY")

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=openai_api_key)

# def get_chat_completion(prompt, model="gpt-3.5-turbo"):
  
#    # Creating a message as required by the API
#    messages = [{"role": "user", "content": prompt}]
  
#    # Calling the ChatCompletion API
#    response = client.chat.completions.create(
#        model=model,
#        messages=messages,
#        temperature=0,
#    )

#    # Returning the extracted response
#    return response.choices[0].message["content"]

# response = get_chat_completion("Translate into Spanish: As a beginner data scientist, I'm excited to learn about OpenAI API!")

# print(response)


@app.route('/lyrics/<title>', methods=['GET'])
def get_lyrics(title):
    genius = lyricsgenius.Genius(genius_api_key)
    song = genius.search_song(title)
    # return jsonify({
    #         "lyrics": song.lyrics
    # })
    return song.lyrics

# @app.route('/lyrics/<title>', methods=['GET'])
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
    # return jsonify({
    #     "prompt": response.choices[0].message.content
    # })
    return response.choices[0].message.content

# @app.route('/lyrics/<title>', methods=['GET'])
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
    # return jsonify({
    #     "prompt": response.choices[0].message.content
    # })
    return response.choices[0].message.content

@app.route('/image/<title>', methods=['GET'])
def get_image(title):
    # lyrics = get_lyrics(title)
    response = client.images.generate(
    model="dall-e-3",
    # prompt="Make an image, do not inlude any of the words, with these vibes + " + title + " + " + generate_first_prompt(title) + " + " + generate_second_prompt(title) + " include only one picture, and pictures only.",
    # prompt="Make an image, do not inlude any of the words, with these vibes + " + generate_first_prompt(title) + " + " + generate_second_prompt(title) + " include only one picture, and pictures only.",
    prompt="Make me an image based on the song " + title,
    size="1024x1024",
    quality="standard",
    n=1,
    )
    image_url = response.data[0].url
    return jsonify({
        "image": image_url,
        "title": title
    })
    
@app.route('/lucky', methods=['GET'])
def get_lucky():
    random_songs = {
        'Dancing Queen ABBA': 'Dancing_Queen.png',
        'Umbrella Rihanna': 'Umbrella.png',
        'Stairway to Heaven Led Zeppelin': ('Stairway_to_Heaven.png', 'Stairway_to_Heaven2.png', 'Stairway_to_Heaven3.png'),
        'Summertime Sadness Lana Del Rey': ('Summertime_Sadness.png', 'Summertime_Sadness2.png'),
        'Bohemian Rhapsody Queen': ('Bohemian_Rhap.png', 'Bohemian_Rhap2.png', 'Bohemian_Rhap3.png', 'Bohemian_Rhap4.png'),
        'You Belong With Me Taylor Swift': ('You_Belong_With_Me_Taylor.png', 'You_Belong_With_Me2.png', 'You_Belong_With_Me3.png'),
        'Watermelon Sugar Harry Styles': 'Watermelon_Sugar_Harry.png',
        'Money Pink Floyd': 'Money.png',
        'Stayin Alive Bee Gees': ('Stayin_Alive.png', 'Stayin_Alive2.png'),
        'Viva La Vida Coldplay': 'Viva_La_Vida.png',
        'Butter BTS': 'Butter.png',
        'Chammak Chalo Akon': 'Chammak_Chalo.png',
        'Margaritaville Jimmy Buffet': 'Margaritaville.png',
        'Hotline Bling Drake': 'Hotline_Bling.png',
        'Glamorous Fergie': 'Glamorous.png'
    }

    random_song = random.choice(list(random_songs.keys()))
    random_path = random_songs[random_song]

    if isinstance(random_path, tuple):
        random_path = random.choice(random_path)

    # get path
    image_path = './images/' + random_path

    return jsonify({
        "image": image_path,
        "title": random_song
    })
    # random_song = random.choice(list(random_songs.keys()))
    # random_path = random_songs[random_song]

    # return jsonify({
    #     "image": random_song,
    #     "title": random_path
    # })



if __name__ == "__main__":
    app.run(debug="True", port=8080)