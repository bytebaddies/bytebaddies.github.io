from flask import Flask, jsonify
from flask_cors import CORS
from openai import OpenAI
import lyricsgenius
import os
import random
import webbrowser
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
    prompt="Make me an image of" + title + "by The Beatles",
    size="1024x1024",
    quality="standard",
    n=1,
    )
    image_url = response.data[0].url
    return jsonify({
        "image": image_url
    })

@app.route('/lucky', methods=['GET'])
def get_lucky():
    # print("Lucky endpoint called")
    # try:
    #     response = client.chat.completions.create(
    #         model="gpt-3.5-turbo-0125",
    #         messages=[
    #             {"role": "system", "content": "You are to respond with a singular word. This word will be used to randomly generate a song name"},
    #         ],
    #     )
    #     print(response.choices[0].message.content)
    #     return get_image(response)
    # except Exception as e:
    #     print(f"Error occurred: {e}")  # Better error logging
    #     return jsonify({"error": str(e)}), 500

    random_songs = ["Dancing Queen ABBA", "Umbrella Rihanna", 
                    "Stairway to Heaven Led Zeppelin", "Summertime Sadness Lana Del Rey", 
                    "Bohemian Rhapsody Queen", "You Belong With Me Taylor Swift", 
                    "Watermelon Sugar Harry Styles", "Money Pink Floyd", 
                    "Stayin Alive Bee Gees", "Viva La Vida Coldplay",
                    "Butter BTS", "Chammak Chalo Akon", "Margaritaville Jimmy Buffet",
                    "Hotline Bling Drake", "Glamorous Fergie"]
    random_song = random_songs[random.randint(0, len(random_songs) - 1)]
    
    return get_image("While my Guitar Gently Weeps")



    

if __name__ == "__main__":
    app.run(debug="False", port=8080)