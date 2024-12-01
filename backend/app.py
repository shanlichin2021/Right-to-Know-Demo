from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import logging

app = Flask(__name__)
CORS(app)  # Enable CORS to allow React frontend communication

# API configuration
O_SERVER = "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate"

# Enable detailed logging
logging.basicConfig(level=logging.DEBUG)

@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        # Get the user's message from the request
        user_message = request.json.get("message")
        if not user_message:
            app.logger.error("No message provided in the request.")
            return jsonify({"error": "No message provided"}), 400

        app.logger.debug(f"Received message: {user_message}")

        # Prepare the payload for the Llama API
        payload = {
            "model": "llama3.2",
            "prompt": user_message,
            "stream": False
        }
        headers = {"Content-Type": "application/json"}

        # Send the request to the Llama API
        response = requests.post(O_SERVER, json=payload, headers=headers)
        response.raise_for_status()  # Raise an exception for HTTP errors

        # Extract and return the AI's response
        data = response.json()
        app.logger.debug(f"API response: {data}")
        reply = data.get("response", "No response received from the model.")
        return jsonify({"reply": reply})

    except requests.exceptions.RequestException as e:
        app.logger.error(f"Error connecting to the Llama API: {e}")
        return jsonify({"error": f"Failed to connect to the API: {str(e)}"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

if __name__ == "__main__":
    app.run(debug=True)
