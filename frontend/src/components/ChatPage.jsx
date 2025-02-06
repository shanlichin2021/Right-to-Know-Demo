import React, { useContext, useState } from "react";
import axios from "axios";
import { ChatContext } from "./ChatContext";
import { ModelEndpointContext } from "./ModelEndpointContext";
import { HashLoader } from "react-spinners";
import ChatSidebar from "./ChatSidebar";

const ChatPage = () => {
  const { messages, addMessage, saveChat } = useContext(ChatContext);
  const { selectedEndpoint } = useContext(ModelEndpointContext);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userEntry = { sender: "user", text: currentMessage };
    addMessage(userEntry);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/chat", {
        history: messages,
        message: currentMessage,
        modelUrl: selectedEndpoint ? selectedEndpoint.url : "",
      });

      const aiEntry = { sender: "ai", text: response.data.reply };
      addMessage(aiEntry);

      if (messages.length === 0) {
        saveChat([...messages, userEntry, aiEntry]);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar />
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1 overflow-auto bg-white shadow-md rounded-lg p-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } my-2`}
            >
              <div
                className={`px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center my-4">
              <HashLoader color="#007bff" size={30} />
            </div>
          )}
        </div>

        <div className="flex items-center bg-white shadow-md p-3 rounded-lg mt-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg"
            placeholder="Type your message..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
