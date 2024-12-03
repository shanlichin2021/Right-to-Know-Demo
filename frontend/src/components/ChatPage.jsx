import React, { useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "./ChatContext";
import "./ChatPage.css";
import { HashLoader } from "react-spinners"; // Import the spinner

const formatText = (text) => {
  // Replace **bold** with <strong>bold</strong>
  const formattedText = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Replace newlines with line breaks
  return formattedText.replace(/\n/g, "<br>");
};

const ChatPage = () => {
  const { messages, addMessage } = useContext(ChatContext); // Chat context to store messages
  const [error, setError] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state for spinner

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add the user's message to the chat context
    const userEntry = { sender: "user", text: currentMessage };
    addMessage(userEntry);
    setCurrentMessage(""); // Clear the input field
    setIsLoading(true); // Show the spinner while waiting for AI response

    try {
      // Send chat history and current message to the backend
      const response = await axios.post("http://127.0.0.1:5000/api/chat", {
        history: messages, // Include all previous messages
        message: currentMessage, // Current user message
      });

      // Add AI response to the chat context
      const aiEntry = { sender: "ai", text: response.data.reply };
      addMessage(aiEntry);
      setError(""); // Clear any errors
    } catch (err) {
      console.error("Error:", err);
      setError("Unable to fetch a response. Please try again.");
      addMessage({ sender: "ai", text: "Error: Unable to fetch a response." });
    } finally {
      setIsLoading(false); // Hide the spinner
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message-container ${
              msg.sender === "user"
                ? "user-message-container"
                : "ai-message-container"
            }`}
          >
            <div
              className={`message-bubble ${
                msg.sender === "user" ? "user-message" : "ai-message"
              }`}
              dangerouslySetInnerHTML={{
                __html: msg.sender === "ai" ? formatText(msg.text) : msg.text,
              }}
            ></div>
          </div>
        ))}
        {isLoading && (
          <div className="loading-container">
            <HashLoader color="#007bff" size={30} />
          </div>
        )}
      </div>
      {error && <div className="error">{error}</div>}
      <div className="input-container">
        <input
          type="text"
          placeholder="Type your message here..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
