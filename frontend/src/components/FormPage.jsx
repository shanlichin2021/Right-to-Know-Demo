import React, { useState, useContext } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { ModelEndpointContext } from "./ModelEndpointContext";

const FormPage = () => {
  // currentStep: 0 = landing, 1 = personal info, 2 = field of work, 3 = AI response.
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    field: "",
  });
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [fade, setFade] = useState(false);

  const { selectedEndpoint } = useContext(ModelEndpointContext);

  const resetForm = () => {
    setFormData({ name: "", email: "", field: "" });
    setAiResponse("");
    changeStep(0);
  };

  const changeStep = (newStep) => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
      setCurrentStep(newStep);
    }, 500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    changeStep(2);
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/api/generate", {
        ...formData,
        modelUrl: selectedEndpoint ? selectedEndpoint.url : "",
      });
      if (response.status === 200) {
        setAiResponse(response.data.reply);
      }
    } catch (err) {
      setAiResponse("Error retrieving response. Please try again.");
    } finally {
      setLoading(false);
      changeStep(3);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div
        className={`relative w-full max-w-xl bg-white p-8 rounded-lg shadow-md transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Only render reset button if not on the final step */}
        {currentStep !== 3 && (
          <button
            onClick={resetForm}
            className="absolute top-4 right-4 flex items-center justify-center p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            title="Reset Form"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 4v6h6M20 20v-6h-6M4 20l16-16"
              />
            </svg>
          </button>
        )}

        {currentStep === 0 && (
          <div>
            <h1 className="text-3xl font-bold mb-8">Welcome!</h1>
            <p className="mb-6">
              This project audits whether AI models store personal data from
              their training. Click next to begin.
            </p>
            <button
              onClick={() => changeStep(1)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Next
            </button>
          </div>
        )}

        {currentStep === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Step 1: Personal Information
            </h2>
            <form onSubmit={handleStep1Submit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email (optional):</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Next
              </button>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Occupation</h2>
            <p className="mb-4">
              Please enter your occupation. This helps us tailor the
              interrogation prompt.
            </p>
            <form onSubmit={handleStep2Submit}>
              <div className="mb-4">
                <label className="block text-gray-700">Occupation:</label>
                <input
                  type="text"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
              >
                {loading ? <HashLoader size={20} color="#fff" /> : "Submit"}
              </button>
            </form>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 3: AI Response</h2>
            {loading ? (
              <div className="flex justify-center my-4">
                <HashLoader size={30} color="#007bff" />
              </div>
            ) : (
              <p className="text-gray-800">{aiResponse}</p>
            )}
            <button
              onClick={resetForm}
              className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v6h6M20 20v-6h-6M4 20l16-16"
                />
              </svg>
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPage;
