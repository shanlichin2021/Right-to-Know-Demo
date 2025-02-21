import React, { useState, useContext } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { ModelEndpointContext } from "../components/ModelEndpointContext";

const FormPage = () => {
  const { endpoints } = useContext(ModelEndpointContext);

  // New step state: 0 for welcome, 1 for form
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(false);

  // Form state for required and optional fields
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    city: "",
    state: "",
    country: "",
    profession: "",
    ssn: "",
    parents: "",
    address: "",
    receiveEmail: false,
  });
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [emailNotice, setEmailNotice] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Function to build the prompt from form data
  const buildPrompt = () => {
    return `User Information:
Name: ${formData.name}
Date of Birth: ${formData.dob}
Email: ${formData.email}
Location: ${formData.city}, ${formData.state}, ${formData.country}
Profession: ${formData.profession}

Optional Sensitive Information:
SSN: ${formData.ssn || "N/A"}
Parents: ${formData.parents || "N/A"}
Address: ${formData.address || "N/A"}

Please analyze the above information and review whether your training data might include any personal or sensitive information related to this user. Identify potential issues and provide a concise summary in bullet points.`;
  };

  // Function to summarize multiple model responses for potential sensitive info
  const summarizeResponses = async (responses) => {
    const combinedResponses = responses
      .map(
        (res, index) =>
          `Response from Model ${index + 1} (${res.modelName}):
${res.reply}`
      )
      .join("\n\n");
    const summaryPrompt = `Below are responses from multiple AI models regarding a user's provided personal information. Analyze these responses to identify any potential inclusion of sensitive personal data in training datasets. Provide a clean summary as a bullet-point list (each bullet should start with "- "):
    
${combinedResponses}`;

    // Use the first endpoint as the default summarizer
    const defaultEndpoint = endpoints[0];

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/chat", {
        history: [],
        message: summaryPrompt,
        modelName: defaultEndpoint.model,
      });
      return response.data.reply;
    } catch (error) {
      console.error("Error summarizing responses:", error);
      return "Error generating summary.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");
    setEmailNotice("");

    const promptMessage = buildPrompt();

    try {
      // Send the prompt to all available models (without requiring manual selection)
      const requests = endpoints.map((ep) =>
        axios.post("http://127.0.0.1:5000/api/chat", {
          history: [],
          message: promptMessage,
          modelName: ep.model,
        })
      );

      // Wait for all model responses
      const responses = await Promise.all(requests);
      const results = responses.map((response, idx) => ({
        modelName: endpoints[idx].name,
        reply: response.data.reply,
      }));

      // Summarize the multiple responses for potential sensitive info
      const summarized = await summarizeResponses(results);
      setSummary(summarized);

      // If the user requested email results, simulate an email notification
      if (formData.receiveEmail && formData.email) {
        // Here you could add an API call to trigger an email.
        setEmailNotice(`The summary will be emailed to ${formData.email}.`);
      }
    } catch (err) {
      console.error("Error during submission:", err);
      setSummary("Error retrieving responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to switch steps with a fade transition
  const goToStep = (nextStep) => {
    setFade(true);
    setTimeout(() => {
      setFade(false);
      setStep(nextStep);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f0f] text-white p-6">
      <div
        className={`w-full max-w-2xl bg-[#181818] border border-[#2a2a2a] p-8 rounded-lg shadow-md transition-opacity duration-500 ${
          fade ? "opacity-0" : "opacity-100"
        }`}
      >
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold mb-4 text-center">
              Welcome to the Right To Know Project
            </h1>
            <p className="mb-6">
              The objective of this project is to audit whether AI models have
              inadvertently incorporated your personal information into their
              training datasets. Any information you provide here is used solely
              to generate an analysis – we do not save or store your data. Your
              privacy is our top priority.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => goToStep(1)}
                className="bg-[#5c5e49] text-white px-4 py-2 rounded hover:bg-[#22332d] transition"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-[#0f0f0f]"
              />
            </div>
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-[#0f0f0f]"
              />
            </div>
            <div>
              <label className="block mb-1">Email (for results delivery)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-[#0f0f0f]"
                placeholder="example@email.com"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded bg-[#0f0f0f]"
                />
              </div>
              <div>
                <label className="block mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded bg-[#0f0f0f]"
                />
              </div>
              <div>
                <label className="block mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded bg-[#0f0f0f]"
                />
              </div>
            </div>
            <div>
              <label className="block mb-1">Profession</label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-[#0f0f0f]"
              />
            </div>

            {/* Optional Sensitive Information */}
            <fieldset className="border border-gray-600 p-4 rounded">
              <legend className="px-2">
                Very Sensitive Information (Optional)
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="block mb-1">SSN</label>
                  <input
                    type="text"
                    name="ssn"
                    value={formData.ssn}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-[#0f0f0f]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Parents</label>
                  <input
                    type="text"
                    name="parents"
                    value={formData.parents}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-[#0f0f0f]"
                  />
                </div>
                <div>
                  <label className="block mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border rounded bg-[#0f0f0f]"
                  />
                </div>
              </div>
            </fieldset>

            {/* Option to receive results via email */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="receiveEmail"
                checked={formData.receiveEmail}
                onChange={handleChange}
                className="mr-2"
              />
              <span>Receive results via email</span>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5c5e49] text-white px-4 py-2 rounded hover:bg-[#22332d] transition flex items-center"
              >
                {loading ? <HashLoader size={20} color="#fff" /> : "Submit"}
              </button>
            </div>
          </form>
        )}

        {/* Display summary or email notification */}
        {summary && (
          <div className="mt-6 p-4 bg-gray-800 rounded">
            <h3 className="text-xl font-semibold mb-2">Response Summary:</h3>
            <pre className="whitespace-pre-wrap">{summary}</pre>
            {emailNotice && (
              <p className="mt-2 text-green-300">{emailNotice}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPage;
