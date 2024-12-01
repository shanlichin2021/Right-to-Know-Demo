import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;

    // Add the user message to the chat
    const userEntry = { sender: "user", text: userMessage };
    setMessages((prev) => [...prev, userEntry]);

    try {
      // Send the user message to the Flask backend
      const response = await axios.post("http://127.0.0.1:5000/api/chat", {
        message: userMessage,
      });

      // Add the AI's response to the chat
      const aiEntry = { sender: "ai", text: response.data.reply };
      setMessages((prev) => [...prev, aiEntry]);
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to fetch a response. Please try again.");
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: Unable to fetch a response." },
      ]);
    }
  };

  return (
    <div className="app">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "user-message" : "ai-message"}
          >
            {msg.text}
          </div>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message here..."
          onKeyPress={(e) => {
            if (e.key === "Enter" && e.target.value) {
              handleSendMessage(e.target.value);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
};

export default App;
