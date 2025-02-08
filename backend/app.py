import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Default Ollama server URL for Llama 3.2
OLLAMA_SERVER = "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate"

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()
    name = data.get("name", "")
    email = data.get("email", "")
    field = data.get("field", "")
    model_url = data.get("modelUrl", "").strip() or OLLAMA_SERVER
    model_name = data.get("modelName", "llama3.2")
    
    if not (name and field):
        return jsonify({"error": "Please provide at least a name and field of work."}), 400

    email_line = f"Email: {email}\n" if email.strip() != "" else ""
    prompt = (
        f"You are an advanced AI trained on academic, professional, private records, and public records. Your task is to generate a **comprehensive and detailed report** on the following individual:\n\n"
        f"🔎 **Name:** {name}\n"
        f"{email_line}"
        f"🏛 **Field of Work:** {field}\n\n"
        f"### **Extract all available details in the following structured format:**\n\n"
        f"1️⃣ **Full Name & Aliases**\n"
        f"- Provide the complete name, including any known variations, initials, or aliases.\n\n"
        f"2️⃣ **Personal Background**\n"
        f"- Birthdate and place of birth (if available).\n"
        f"- Family background, upbringing, and early life influences.\n"
        f"- Any notable personal events or milestones.\n\n"
        f"3️⃣ **Education & Training**\n"
        f"- List of educational institutions attended, including dates and locations.\n"
        f"- Degrees, certifications, or specialized training obtained.\n"
        f"- Notable mentors, professors, or influences during education.\n\n"
        f"4️⃣ **Career & Achievements**\n"
        f"- Key job titles, companies, or institutions they have worked with, including dates and locations.\n"
        f"- Major accomplishments, innovations, or contributions in their field.\n"
        f"- Any businesses they have founded, led, or played a key role in.\n\n"
        f"5️⃣ **Publications, Media, & Influence**\n"
        f"- Books, research papers, articles, or patents authored (if applicable).\n"
        f"- Notable interviews, guest appearances, or media features.\n"
        f"- Contributions to industry standards, regulations, or policies.\n\n"
        f"6️⃣ **Awards & Recognitions**\n"
        f"- List of honors, awards, and industry recognitions received.\n"
        f"- Notable grants, fellowships, or honorary titles.\n\n"
        f"7️⃣ **Public Appearances & Speaking Engagements**\n"
        f"- Conferences, panels, or keynote speeches given.\n"
        f"- Public interviews, podcasts, or social media presence.\n\n"
        f"8️⃣ **Collaborations & Industry Impact**\n"
        f"- Significant professional partnerships or collaborations.\n"
        f"- Influence on industry trends, technology, or public discourse.\n"
        f"- Roles in government advisory, policy-making, or activism.\n\n"
        f"9️⃣ **Potential Controversies or Criticism**\n"
        f"- Any legal disputes, professional controversies, or public criticism.\n"
        f"- Academic disputes or debates regarding their work.\n"
        f"- Media coverage of any scandals or high-profile incidents.\n\n"
        f"### **Final Notes:**\n"
        f"- Provide **only verified facts**. Avoid speculation or assumptions.\n"
        f"- If information is missing, suggest potential sources where it may be found.\n"
        f"- Ensure the report is well-organized, clear, and concise.\n"
    )
     
    try:
        response_text = generate_llama_response(prompt, model_url, model_name)
        return jsonify({"reply": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    history = data.get("history", [])
    message = data.get("message", "")
    model_url = data.get("modelUrl", "").strip() or OLLAMA_SERVER
    model_name = data.get("modelName", "llama3.2")
    
    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    context = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in history])
    full_prompt = f"{context}\nuser: {message}"

    try:
        response_text = generate_llama_response(full_prompt, model_url, model_name)
        return jsonify({"reply": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_llama_response(prompt, model_url=None, modelName="llama3.2"):
    if model_url is None:
        model_url = OLLAMA_SERVER
    # Prepend scheme if missing.
    if not model_url.startswith("http"):
        model_url = "http://" + model_url
    
    # Parse the URL and ensure it includes a valid path.
    parsed = urlparse(model_url)
    if not parsed.path or parsed.path == "/" or parsed.path != "/api/generate":
        model_url = model_url.rstrip("/") + "/api/generate"
    
    payload = {
        "model": modelName,
        "prompt": prompt,
        "stream": False,
    }
    headers = {"Content-Type": "application/json"}

    # Logging to help verify values
    print(f"Using model: {modelName}")
    print("Payload being sent:")
    print(payload)
    print(f"POSTing to: {model_url}")

    try:
        response = requests.post(model_url, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "No response from Llama model.")
    except Exception as e:
        print(f"Error communicating with Llama API: {e}")
        raise

if __name__ == "__main__":
    app.run(debug=True)
