import React from "react";

const AboutPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600">
        About the Right to Know Framework
      </h1>
      <p className="text-gray-700 mt-2">
        The <strong>Right to Know Framework</strong> allows users to interact
        with large language models, such as Llama 3.2, in a transparent way.
      </p>

      <h2 className="text-xl font-semibold mt-4">How It Works</h2>
      <p className="text-gray-700">The framework consists of:</p>
      <ul className="list-disc pl-6 text-gray-700 mt-2">
        <li>A React-based frontend for chat interactions.</li>
        <li>A Flask backend that processes user input and AI responses.</li>
        <li>Integration with Llama 3.2 for AI-generated responses.</li>
      </ul>
    </div>
  );
};

export default AboutPage;
