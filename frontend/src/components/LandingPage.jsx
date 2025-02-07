import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#0f0f0f] p-8">
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
              "'Right To Know' is a project that audits whether AI models store personal data from their training. Our mission is to empower you with the right to know if your personal information has been inadvertently included in AI training datasets. Through a step-by-step process, we aim to increase the transparency of LLMs and help protect your privacy.",
            ]}
            typeSpeed={14}
            deleteSpeed={50}
            delaySpeed={2000}
            cursor
            cursorStyle="|"
          />
        </p>
        <div className="flex flex-row items-center justify-center md:w-1/2 space-x-4">
          <Link to="/form">
            <button className="bg-[#5c5e49] text-white px-4 py-3 rounded hover:bg-[#22332d] transition">
              Get Started
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-[#b1a078] text-white px-4 py-3 rounded hover:bg-[#9f8d7e] transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
