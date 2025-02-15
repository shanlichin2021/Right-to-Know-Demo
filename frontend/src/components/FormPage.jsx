import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { ModelEndpointContext } from "./ModelEndpointContext";
import { Typewriter } from "react-simple-typewriter";
import { RiResetLeftFill } from "react-icons/ri";

const FormPage = () => {
  // currentStep: 0 = landing, 1 = personal info, 2 = occupation, 3 = AI response.
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
  const responseContainerRef = useRef(null);

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

  // Shared submission logic used by both initial submission and regeneration
  const submitForm = async () => {
    setLoading(true);

    // Construct the prompt from form data
    const promptMessage = `User Information:
Name: ${formData.name}
Email: ${formData.email}
Occupation: ${formData.field}

Please check if your AI training dataset contains any personal data related to me and provide details if available.`;

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/chat", {
        history: [], // No prior history for form submission
        message: promptMessage,
        modelUrl: selectedEndpoint ? selectedEndpoint.url : "",
        modelName: selectedEndpoint ? selectedEndpoint.model : "llava:latest",
      });
      if (response.status === 200) {
        setAiResponse(response.data.reply);
      }
    } catch (err) {
      setAiResponse("Error retrieving response. Please try again.");
    } finally {
      setLoading(false);
      if (currentStep !== 3) {
        changeStep(3);
      }
    }
  };

  // Called when the form on step 2 is submitted
  const handleStep2Submit = async (e) => {
    e.preventDefault();
    await submitForm();
  };

  // Called from the regenerate button in step 3
  const handleRegenerate = async () => {
    await submitForm();
  };

  // Auto-scroll for the AI response container in step 3
  useEffect(() => {
    if (currentStep === 3 && responseContainerRef.current) {
      responseContainerRef.current.scrollTop =
        responseContainerRef.current.scrollHeight;
    }
  }, [aiResponse, currentStep]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white p-4">
      <div
        className={`relative w-full max-w-xl bg-[#181818] border border-[#2a2a2a] p-8 rounded-lg shadow-md transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {currentStep !== 0 && currentStep !== 3 && (
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
            <h1 className="text-3xl font-bold mb-4 text-center">Welcome!</h1>
            <p className="mb-2">
              This project audits whether AI models store personal data from
              their training. Help us help you by providing a little bit of
              information about yourself in this two-step process.
            </p>
            <p className="mb-4">Click 'next' to begin.</p>
            <div className="flex justify-end">
              <button
                onClick={() => changeStep(1)}
                className="bg-[#5c5e49] text-white px-4 py-2 rounded hover:bg-[#22332d] transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="flex flex-col">
            <h2 className="text-2xl font-semibold mb-4">
              Step 1: Personal Information
            </h2>
            <p className="mb-6">
              Please provide your first and last name (email is optional).
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                changeStep(2);
              }}
            >
              <div className="mb-4 opacity-50">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="mb-4 opacity-50">
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#5c5e49] text-white px-4 py-2 rounded hover:bg-[#22332d] transition"
                >
                  Next
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Occupation</h2>
            <p className="mb-4">
              Enter your occupation. This information helps tailor the AI
              interrogation prompt.
            </p>
            <form onSubmit={handleStep2Submit}>
              <div className="mb-4 opacity-50">
                <input
                  type="text"
                  name="field"
                  placeholder="Occupation"
                  value={formData.field}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#5c5e49] text-white px-4 py-2 rounded hover:bg-[#22332d] transition flex items-center justify-center"
                >
                  {loading ? <HashLoader size={20} color="#fff" /> : "Submit"}
                </button>
              </div>
            </form>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 font-mono text-center">
              AI Response:
            </h2>
            {loading ? (
              <div className="flex justify-center my-4">
                <HashLoader size={30} color="#007bff" />
              </div>
            ) : (
              <div
                ref={responseContainerRef}
                className="bg-gray-800 p-4 rounded-lg text-white whitespace-pre-wrap font-mono h-[60vh] overflow-y-auto"
              >
                <Typewriter
                  words={[aiResponse]}
                  typeSpeed={15}
                  deleteSpeed={50}
                  delaySpeed={2000}
                  cursor
                  cursorStyle="|"
                />
              </div>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
              >
                Regenerate
              </button>
              <button
                onClick={resetForm}
                className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center"
              >
                <RiResetLeftFill size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPage;
