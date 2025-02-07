import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 m p-8">
      <h1 className="text-4xl font-bold mb-8">Right To Know</h1>
      <div className=" flex flex-col  items-center justify-center md:w-1/2">
        <p className="text-lg text-center mb-8 ">
          This project audits whether AI models store personal data from their
          training. Our mission is to empower you with the right to know if your
          personal information has been inadvertently included in AI training
          datasets. Through a series of targeted interrogations and
          investigations, we aim to increase transparency and protect your
          privacy.
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
