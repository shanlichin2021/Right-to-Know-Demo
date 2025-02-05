import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import ChatPage from "./components/ChatPage";
import AboutPage from "./components/AboutPage";
import { ChatProvider } from "./components/ChatContext";
import FormPage from "./components/FormPage";

const App = () => {
  return (
    <ChatProvider>
      <Router>
        <div className="h-screen flex flex-col">
          <TopBar />
          <div className="flex-1 bg-gray-200 p-6 mt-16">
            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/form" element={<FormPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ChatProvider>
  );
};

export default App;
