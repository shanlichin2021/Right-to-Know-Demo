# Right to Know - Chat Framework

The **Right to Know Framework** is a simple, interactive web application that allows users to communicate with the Llama 3.2 language model. This project connects a Flask backend to the Llama API and uses a React frontend to display the responses, creating a seamless interface for users.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Setup](#setup)
   - [Clone the Repository](#clone-the-repository)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
4. [Running the Application](#running-the-application)
5. [Usage](#usage)
6. [Troubleshooting](#troubleshooting)
7. [License](#license)

---

## Features

- **Frontend**: React-based chat interface for user input and AI-generated responses.
- **Backend**: Flask API that communicates with the Llama 3.2 model.
- **Dynamic Responses**: Displays conversation history in real time.
- **CORS Support**: Allows seamless communication between the frontend and backend.
- **Error Handling**: Provides detailed error messages for debugging.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. **Python** (version 3.7 or higher)
2. **Node.js** (version 14 or higher) with `npm`
3. **pip** (Python package manager)

---

## Setup

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone <repository_url>
cd Right-to-Know-Demo
```

### Backend Setup

1. Navigate to the `backend` folder:

   ```bash
   cd backend
   ```

2. (Optional) Create a Python virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the required Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

---

### Frontend Setup

1. Navigate to the `frontend` folder:

   ```bash
   cd ../frontend
   ```

2. Install the required npm dependencies:

   ```bash
   npm install
   ```

---

## Running the Application

1. **Start the Backend**:

   - Navigate to the `backend` directory and run:
     ```bash
     python app.py
     ```

2. **Start the Frontend**:

   - Navigate to the `frontend` directory and run:
     ```bash
     npm run dev
     ```

3. Open your browser and navigate to `http://localhost:5173/` to access the application.

---

## Usage

1. **Enter a Message**:

   - Type your query in the input field (e.g., "Who is Fernando Koch?").

2. **Receive AI Response**:

   - The AI's response will appear below your message in the chat window.

3. **Error Handling**:
   - If there’s an issue fetching the AI response, an error message will be displayed.

---

## Troubleshooting

### Common Issues

#### 1. `ModuleNotFoundError` for `flask_cors`:

- Run the following command to install the required package:
  ```bash
  pip install flask-cors
  ```

#### 2. CORS Errors in Browser:

- Ensure `flask_cors` is enabled in the backend:
  ```python
  from flask_cors import CORS
  CORS(app)
  ```

#### 3. API Connection Errors:

- Verify the `O_SERVER` variable in `app.py` points to the correct API endpoint:
  ```python
  O_SERVER = "https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate"
  ```
- Test the API directly using `curl`:
  ```bash
  curl -X POST -H "Content-Type: application/json" \
  -d '{"model": "llama3.2", "prompt": "Hello, AI!", "stream": false}' \
  https://cot6930-ollama-serve.kub.hpc.fau.edu/api/generate
  ```

#### 4. React Frontend Not Loading:

- Ensure the React app is running:
  ```bash
  npm start
  ```
- Verify that the backend is accessible at `http://127.0.0.1:5000`.

#### 5. Flask Backend Issues:

- Ensure the Flask app is running:
  ```bash
  python app.py
  ```

---

## License

This project is licensed under the MIT License. Feel free to use and modify it for your own purposes.
