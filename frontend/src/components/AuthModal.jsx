import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { motion } from "framer-motion";
import { RiDoorLockLine } from "react-icons/ri";

const AuthModal = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(username, password);
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    }
  };

  if (user) return null; // If logged in, do not show the modal

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-sm z-50">
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="bg-[#181818] border border-[#2a2a2a] text-white p-10 rounded shadow-lg max-w-md w-full">
          <div className="flex justify-center mb-8">
            <RiDoorLockLine size={25} />
          </div>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#0f0f0f] w-full p-2 border rounded opacity-50 focus:outline-none focus:ring"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" bg-[#0f0f0f] w-full p-2 border rounded opacity-50 focus:outline-none focus:ring"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#5c5e49] w-full text-white py-2 rounded hover:bg-[#22332d] transition"
            >
              Login
            </button>
          </form>
        </div>
      </motion.h1>
    </div>
  );
};

export default AuthModal;
