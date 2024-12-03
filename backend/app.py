import requests
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from duckduckgo_search import DDGS  # Import DDGS for DuckDuckGo search

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

OLLAMA_SERVER = "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate"


@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    history = data.get("history", [])
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    # Combine chat history into a single prompt
    context = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in history])
    full_prompt = f"{context}\nuser: {message}"

    # Check if DuckDuckGo search is needed
    if "who is" in message.lower() or "what is" in message.lower():
        search_query = message.replace("who is", "").replace("what is", "").strip()
        external_info = fetch_duckduckgo_info(search_query)

        if external_info:
            full_prompt = f"{full_prompt}\n\nDuckDuckGo Information:\n{external_info}"

    try:
        # Send prompt to the Llama model
        response = generate_llama_response(full_prompt)
        return jsonify({"reply": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def fetch_duckduckgo_info(query, max_results=3):
    """Fetch information from DuckDuckGo using the DDGS library."""
    try:
        time.sleep(1)  # Throttle requests by adding a delay
        with DDGS() as ddgs:
            # Adjust parameters and headers to avoid being blocked
            results = ddgs.text(
                query, region="wt-wt", safesearch="Moderate", timelimit=None
            )
            result_list = []
            for result in results:
                result_list.append(f"- {result['title']}: {result['href']}")
                if len(result_list) >= max_results:
                    break
            return "\n".join(result_list) if result_list else "No relevant search results found."
    except Exception as e:
        print(f"Error fetching DuckDuckGo information: {e}")
        return "Unable to fetch search results at this time. Proceeding with AI-generated information."


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
