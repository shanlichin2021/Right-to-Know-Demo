import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

OLLAMA_SERVER = "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate"
DUCKDUCKGO_API_URL = "https://api.duckduckgo.com/"

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    history = data.get("history", [])
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    # Combine chat history into a single prompt
    context = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in history])
    full_prompt = f"{context}\n{message}"

    # Check if DuckDuckGo search is needed
    if "who is" in message.lower() or "what is" in message.lower():
        search_query = message.replace("who is", "").replace("what is", "").strip()
        external_info = fetch_duckduckgo_info(search_query)

        if external_info:
            full_prompt = f"{full_prompt}\n\nDuckDuckGo Information: {external_info}"

    try:
        # Send prompt to the Llama model
        response = generate_llama_response(full_prompt)
        return jsonify({"reply": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def fetch_duckduckgo_info(query):
    """Fetch information from DuckDuckGo Instant Answer API."""
    params = {
        "q": query,
        "format": "json",
        "no_redirect": 1,
        "no_html": 1,
    }
    try:
        response = requests.get(DUCKDUCKGO_API_URL, params=params)
        if response.status_code == 200:
            data = response.json()
            return data.get("AbstractText") or data.get("Heading")
    except Exception as e:
        print(f"Error fetching DuckDuckGo information: {e}")
    return None


def generate_llama_response(prompt):
    """Send the prompt to the Llama model."""
    payload = {
        "model": "llama3.2",
        "prompt": prompt,
        "stream": False,
    }
    headers = {"Content-Type": "application/json"}

    try:
        response = requests.post(OLLAMA_SERVER, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "No response from Llama model.")
    except Exception as e:
        print(f"Error communicating with Llama API: {e}")
        raise

if __name__ == "__main__":
    app.run(debug=True)
