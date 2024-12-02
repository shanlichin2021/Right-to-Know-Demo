import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import ChatPage from "./components/ChatPage";
import AboutPage from "./components/AboutPage";
import { ChatProvider } from "./components/ChatContext";
import "./App.css";

const App = () => {
  return (
    <ChatProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ChatProvider>
  );
};

export default App;
