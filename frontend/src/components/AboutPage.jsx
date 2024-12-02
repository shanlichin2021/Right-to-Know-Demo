import React from "react";
import "./AboutPage.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1>About the Right to Know Framework</h1>
      <p>
        The <strong>Right to Know Framework</strong> is an innovative project
        that allows users to interact with large language models, such as Llama
        3.2, in a transparent and accessible way. Inspired by the "Right to Be
        Forgotten" principle, this framework aims to empower individuals by
        providing them with tools to understand and control their digital
        presence in AI systems.
      </p>
      <h2>What is the Right to Know Framework?</h2>
      <p>
        This framework is a user-friendly interface that connects a React
        frontend with a Flask backend and integrates with the Llama 3.2 AI
        model. It allows users to:
      </p>
      <ul>
        <li>Send queries to the AI model and receive intelligent responses.</li>
        <li>Engage in seamless, persistent conversations.</li>
        <li>Understand the impact of AI-generated content.</li>
      </ul>
      <h2>Purpose</h2>
      <p>
        The Right to Know Framework is designed to promote responsible AI
        practices by:
      </p>
      <ul>
        <li>Providing transparency about AI interactions.</li>
        <li>Enabling users to assess their presence in AI models.</li>
        <li>
          Encouraging research into balancing data privacy and utility in AI
          systems.
        </li>
      </ul>
      <h2>How It Works</h2>
      <p>The framework consists of three main components:</p>
      <ol>
        <li>
          <strong>Frontend:</strong> A React-based interface that displays chat
          interactions and allows users to navigate between pages like "Chat"
          and "About."
        </li>
        <li>
          <strong>Backend:</strong> A Flask application that processes user
          input, communicates with the AI model, and returns responses.
        </li>
        <li>
          <strong>AI Integration:</strong> Integration with the Llama 3.2
          language model for generating intelligent responses to user queries.
        </li>
      </ol>
      <h2>Future Enhancements</h2>
      <p>
        The framework is designed to be scalable and flexible. Future updates
        may include:
      </p>
      <ul>
        <li>Advanced user settings and customizations.</li>
        <li>Integration with additional AI models.</li>
        <li>Improved visualizations for AI interactions.</li>
      </ul>
    </div>
  );
};

export default AboutPage;
