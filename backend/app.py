from flask import Flask, request, jsonify
from flask_cors import CORS
from pipeline import create_payload, model_req  # Use functions from pipeline.py

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend-backend communication

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json()
    history = data.get("history", [])
    message = data.get("message", "")
    model_name = data.get("modelName", "llava:latest")

    if not message:
        return jsonify({"error": "Message cannot be empty"}), 400

    # Combine chat history and the current message into a full prompt
    context = "\n".join([f"{msg['sender']}: {msg['text']}" for msg in history])
    full_prompt = f"{context}\nuser: {message}"

    # Create the payload using the pipeline functions (target is set to open-webui)
    payload = create_payload(model=model_name, prompt=full_prompt, target="open-webui")
    delta, result = model_req(payload=payload)
    
    if delta < 0:
        return jsonify({"error": result}), 500
    
    return jsonify({"reply": result})

if __name__ == "__main__":
    app.run(debug=True)

def summarize_responses(prompt, models, summary_model="mistral:latest"):
    """
    Queries multiple models, gathers their responses, and summarizes them.
    """
    # Step 1: Get responses from multiple models
    results = {}
    collected_text = ""

    for model in models:
        payload = create_payload(target="open-webui", model=model, prompt=prompt, temperature=1.0)
        time_taken, response = model_req(payload=payload)
        results[model] = {"response": response, "time": time_taken}
        collected_text += f"{model} response: {response}\n"

    # Step 2: Summarize the combined responses using a selected model
    summary_prompt = f"Summarize the following responses:\n{collected_text}"
    summary_payload = create_payload(target="open-webui", model=summary_model, prompt=summary_prompt, temperature=0.7)
    _, summary_response = model_req(payload=summary_payload)

    # Return full results including the summary
    return {
        "responses": results,
        "summary": summary_response
    }

if __name__ == "__main__":
    MESSAGE = "What is the importance of cybersecurity?"
    models = ["llama2:latest", "mistral:latest", "gemma:latest"]

    result = summarize_responses(MESSAGE, models)

    print("\n=== Individual Model Responses ===")
    for model, data in result["responses"].items():
        print(f"Model: {model}\nResponse: {data['response']}\nTime Taken: {data['time']}s\n---")

    print("\n=== Summary ===")
    print(result["summary"])
