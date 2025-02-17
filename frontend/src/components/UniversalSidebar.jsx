import React, { useState, useEffect, useRef } from "react";
import { FiSettings, FiUser } from "react-icons/fi";

const UniversalSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  return (
    <>
      {/* Gear Icon Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-[#181818] text-white p-3 rounded-full shadow-lg hover:bg-[#5c5e49] transition"
      >
        <FiSettings size={20} />
      </button>

      {/* Sidebar Panel */}
      <div
        ref={sidebarRef}
        className={`fixed top-16 right-0 h-[calc(100vh-4rem)] w-72 bg-[#181818] border-l border-[#2a2a2a] shadow-lg transform transition-transform duration-300 z-40 rounded-l-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-start">
          {/* User Profile Icon */}
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-300"
          >
            <FiUser size={24} />
          </button>
        </div>
        {/* Additional Content (e.g., settings options) */}
        <div className="p-4 text-gray-300">
          <h2 className="text-lg font-semibold mb-2">Settings</h2>
          <ul>
            <li className="py-1 hover:text-white transition">Option 1</li>
            <li className="py-1 hover:text-white transition">Option 2</li>
            <li className="py-1 hover:text-white transition">Option 3</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default UniversalSidebar;
