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
    lyrics = get_lyrics(title)
    response = client.images.generate(
    model="dall-e-3",
    # prompt="Make an image, do not inlude any of the words, with these vibes + " + title + " + " + generate_first_prompt(title) + " + " + generate_second_prompt(title) + " include only one picture, and pictures only.",
    prompt="Make an image, do not inlude any of the words, with these vibes + " + generate_first_prompt(title) + " + " + generate_second_prompt(title) + " include only one picture, and pictures only.",
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