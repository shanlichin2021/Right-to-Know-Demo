import React, { useState, useContext } from "react";
import { ChatContext } from "./ChatContext";
import axios from "axios";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";

const ChatSidebar = () => {
  const { previousChats, searchChat, setSearchChat } = useContext(ChatContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-72 bg-[#181818] text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 shadow-lg z-50`}
      >
        <div className="p-4">
          <h2 className="text-lg font-bold text-center font-mono">
            Previous Submissions
          </h2>

          {/* Search Bar */}
          <div className="relative my-4">
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 pl-8 text-black rounded back text-white bg-[#0f0f0f] border-[#2a2a2a]"
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
            />
            <FiSearch className="absolute left-2 top-3 text-gray-600" />
          </div>

          {/* Chat List */}
          <ul className="space-y-2">
            {previousChats
              .filter((chat) =>
                chat.name.toLowerCase().includes(searchChat.toLowerCase())
              )
              .map((chat, index) => (
                <li
                  key={index}
                  className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
                >
                  {chat.name}
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Toggle Button styled like a file tab */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-20 left-0 transform transition-transform duration-300 z-50 bg-[#181818] border-e-4 border-[#2a2a2a] text-white shadow-lg rounded-tr-lg rounded-br-lg px-4 py-2 ${
          isOpen ? "translate-x-72" : "translate-x-0"
        }`}
      >
        {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>
    </div>
  );
};

export default ChatSidebar;
