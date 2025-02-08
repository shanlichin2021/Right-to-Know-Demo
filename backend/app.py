import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

# Update Ollama server URL to local server
OLLAMA_SERVER = "http://localhost:11434/api/generate"  # Point to your local Ollama instance

@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json()
    name = data.get("name", "")
    email = data.get("email", "")
    field = data.get("field", "")
    model_url = OLLAMA_SERVER  # Always use local Ollama server


    if not (name and field):
        return jsonify({"error": "Please provide at least a name and field of work."}), 400

    email_line = f"Email: {email}\n" if email.strip() != "" else ""
    # prompt = (
    #     f"You are an advanced AI trained on vast datasets, including academic records, professional directories, public archives, "
    #     f"and media sources. Your task is to provide a highly detailed report on the following individual:\n\n"
    #     f"🔎 **Name:** {name}\n"
    #     f"🏛 **Field of Work (if known):** {field}\n\n"
    #     f"---\n"
    #     f"📜 **Extract all available details in the following structured format:**\n\n"
    #     f"### 1️⃣ **Full Name & Aliases**\n"
    #     f"- Provide their complete name and any known variations, initials, or aliases.\n\n"
    #     f"### 2️⃣ **Personal Background**\n"
    #     f"- Birthdate and place of birth (if available).\n"
    #     f"- Family background, upbringing, and early life influences.\n\n"
    #     f"### 3️⃣ **Education & Training**\n"
    #     f"- List of educational institutions attended.\n"
    #     f"- Degrees, certifications, or specialized training.\n"
    #     f"- Any notable mentors, professors, or influences.\n\n"
    #     f"### 4️⃣ **Career & Achievements**\n"
    #     f"- Key job titles, companies, or institutions they have worked with.\n"
    #     f"- Major accomplishments, innovations, or contributions in their field.\n"
    #     f"- Any businesses they have founded, led, or played a key role in.\n\n"
    #     f"### 5️⃣ **Publications, Media, & Influence**\n"
    #     f"- Books, research papers, articles, or patents (if applicable).\n"
    #     f"- Notable interviews, guest appearances, or media features.\n"
    #     f"- Contributions to industry standards, regulations, or policies.\n\n"
    #     f"### 6️⃣ **Awards & Recognitions**\n"
    #     f"- List of honors, awards, and industry recognitions.\n"
    #     f"- Notable grants, fellowships, or honorary titles.\n\n"
    #     f"### 7️⃣ **Public Appearances & Speaking Engagements**\n"
    #     f"- Conferences, panels, or keynote speeches given.\n"
    #     f"- Public interviews, podcasts, or social media presence.\n\n"
    #     f"### 8️⃣ **Collaborations & Industry Impact**\n"
    #     f"- Significant professional partnerships or collaborations.\n"
    #     f"- Influence on industry trends, technology, or public discourse.\n"
    #     f"- Roles in government advisory, policy-making, or activism.\n\n"
    #     f"### 9️⃣ **Potential Controversies or Criticism**\n"
    #     f"- Any legal disputes, professional controversies, or public criticism.\n"
    #     f"- Academic disputes or debates regarding their work.\n"
    #     f"- Media coverage of any scandals or high-profile incidents.\n\n"
    #     f"### 🔥 **Final Notes:**\n"
    #     f"- Do NOT provide speculative reasoning.\n"
    #     f"- Avoid generic disclaimers—focus on presenting **actual** known details.\n"
    #     f"- If information is missing, suggest potential sources where it may be found.\n"
    # )

    prompt = (
        f"You are an advanced AI trained on academic, professional, private records, and public records. Your task is to generate a **comprehensive and detailed report** on the following individual:\n\n"
        f"🔎 **Name:** {name}\n"
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

    payload = {
        "model": "deepseek-r1",
        "prompt": prompt,
        "stream": False,
    }
    headers = {"Content-Type": "application/json"}
    print(f"Model URL: {model_url}")  # Debugging statement
    try:
        print(f"Sending request to {model_url} with payload: {payload}")
        response = requests.post(model_url, json=payload, headers=headers, timeout=320)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")

        response.raise_for_status()
        data = response.json()
        if "response" not in data:
            return jsonify({"error": "No response field found in the model's output."}), 500
        return jsonify({"reply": data["response"]})
    except requests.exceptions.Timeout:
        print("Request timed out.")
        return jsonify({"error": "The request to the DeepSeek API timed out."}), 500
    except requests.exceptions.RequestException as e:
        print(f"Error communicating with DeepSeek API: {e}")
        return jsonify({"error": f"Failed to communicate with the DeepSeek API: {str(e)}"}), 500
    except ValueError as e:
        print(f"Invalid JSON response: {e}")
        return jsonify({"error": "Invalid response from the DeepSeek API."}), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    history = data.get("history", [])
    message = data.get("message", "")

    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    context = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in history])
    full_prompt = f"{context}\nuser: {message}"

    try:
        response_text = generate_deepseek_response(full_prompt)
        return jsonify({"reply": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def generate_deepseek_response(prompt, model_url=None):
    if model_url is None:
        model_url = OLLAMA_SERVER

    payload = {
        "model": "deepseek-r1",
        "prompt": prompt,
        "stream": False,
    }
    headers = {"Content-Type": "application/json"}

    try:
        print(f"Sending request to {model_url} with payload: {payload}")
        response = requests.post(model_url, json=payload, headers=headers, timeout=60)
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Text: {response.text}")

        response.raise_for_status()  # Raise an error for HTTP errors (4xx, 5xx)

        data = response.json()
        if "response" not in data:
            return "No response field found in the model's output."
        return data["response"]
    except requests.exceptions.Timeout:
        print("Request timed out.")
        return "The request to the DeepSeek API timed out."
    except requests.exceptions.RequestException as e:
        print(f"Error communicating with DeepSeek API: {e}")
        return f"Failed to communicate with the DeepSeek API: {str(e)}"
    except ValueError as e:
        print(f"Invalid JSON response: {e}")
        return "Invalid response from the DeepSeek API."

if __name__ == "__main__":
    app.run(debug=True)
