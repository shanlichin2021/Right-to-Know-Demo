import React from "react";

const AboutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f0f] p-8">
      <div className="max-w-3xl mx-auto p-6 bg-[#181818] border border-[#2a2a2a] shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-4">
          About the Right to Know Framework
        </h1>
        <p className="text-gray-300">
          The <strong>Right to Know Framework</strong> allows users to interact
          with large language models in a transparent way.
        </p>
        <h2 className="text-xl font-semibold mt-6 text-white">How It Works</h2>
        <p className="text-gray-300 mt-2">The framework consists of:</p>
        <ul className="list-disc pl-6 text-gray-300 mt-2">
          <li>A React-based frontend for chat interactions.</li>
          <li>A Flask backend that processes user input and AI responses.</li>
          <li>Integration with Llama 3.2 for AI-generated responses.</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
