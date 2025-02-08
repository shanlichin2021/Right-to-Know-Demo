import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import ChatPage from "./components/ChatPage";
import AboutPage from "./components/AboutPage";
import { ChatProvider } from "./components/ChatContext";
import FormPage from "./components/FormPage";
import { ModelEndpointProvider } from "./components/ModelEndpointContext";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import { AuthProvider } from "./components/AuthContext";
import "./App.css";

const App = () => {
  return (
    <ChatProvider>
      <AuthProvider>
        <ModelEndpointProvider>
          <Router>
            {/* AuthModal overlays all pages until user is logged in */}
            <AuthModal />
            <div className="h-screen flex flex-col">
              <TopBar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/form" element={<FormPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                </Routes>
              </div>
            </div>
          </Router>
        </ModelEndpointProvider>
      </AuthProvider>
    </ChatProvider>
  );
};

export default App;
