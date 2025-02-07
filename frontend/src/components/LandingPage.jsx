import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      {/* Framer Motion fade-in effect */}
      <motion.h1
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        Right To Know
      </motion.h1>

      <div className="flex flex-col items-center justify-center md:w-1/2">
        {/* Typewriter effect for the description */}
        <p className="text-lg text-center mb-8">
          <Typewriter
            words={[
              "'Right To Know' is a project that audits whether AI models store personal data from their training. Our mission is to empower you with the right to know if your personal information has been inadvertently included in AI training datasets. Through a series of targeted interrogations and investigations, we aim to increase the transparency of LLMs and protect your privacy.",
            ]}
            typeSpeed={30}
            deleteSpeed={50}
            delaySpeed={2000}
            cursor
            cursorStyle="|"
          />
        </p>

        <Link to="/form">
          <button className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
