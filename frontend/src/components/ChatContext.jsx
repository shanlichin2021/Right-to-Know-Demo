import React, { createContext, useState } from "react";
import axios from "axios";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [previousChats, setPreviousChats] = useState([]);
  const [searchChat, setSearchChat] = useState("");

  const addMessage = (message) => {
    setMessages((prev) => [...prev, message]);
  };

  const saveChat = async (chatMessages) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/generate-chat-name",
        {
          messages: chatMessages,
        }
      );

      const chatName = response.data.name || `Chat ${previousChats.length + 1}`;
      setPreviousChats([
        ...previousChats,
        { name: chatName, messages: chatMessages },
      ]);
    } catch (error) {
      console.error("Failed to generate chat name:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        addMessage,
        previousChats,
        searchChat,
        setSearchChat,
        saveChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
