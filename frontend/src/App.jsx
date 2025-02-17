import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import ChatPage from "./pages/ChatPage";
import AboutPage from "./pages/AboutPage";
import FormPage from "./pages/FormPage";
import LandingPage from "./pages/LandingPage";
import UniversalSidebar from "./components/UniversalSidebar";
import { ChatProvider } from "./components/ChatContext";
import { ModelEndpointProvider } from "./components/ModelEndpointContext";
import { AuthProvider } from "./components/AuthContext";
import AuthModal from "./components/AuthModal";
import "./App.css";

const App = () => {
  return (
    <ChatProvider>
      <AuthProvider>
        <ModelEndpointProvider>
          <Router>
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
              <UniversalSidebar />
            </div>
          </Router>
        </ModelEndpointProvider>
      </AuthProvider>
    </ChatProvider>
  );
};

export default App;
