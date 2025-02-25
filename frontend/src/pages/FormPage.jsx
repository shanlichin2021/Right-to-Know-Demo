import React, { useState, useContext } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import { ModelEndpointContext } from "../components/ModelEndpointContext";

const FormPage = () => {
  const { endpoints } = useContext(ModelEndpointContext);

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
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Build the prompt based on the form data.
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

  // Summarize multiple responses from the models.
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

    // Use the first endpoint as default summarizer
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

  // Handle the form submission: send prompt to all endpoints, then summarize responses.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSummary("");
    setEmailNotice("");

    const promptMessage = buildPrompt();

    try {
      // Send the prompt to all available models.
      const requests = endpoints.map((ep) =>
        axios.post("http://127.0.0.1:5000/api/chat", {
          history: [],
          message: promptMessage,
          modelName: ep.model,
        })
      );

      // Await responses and format the results.
      const responses = await Promise.all(requests);
      const results = responses.map((response, idx) => ({
        modelName: endpoints[idx].name,
        reply: response.data.reply,
      }));

      // Summarize the responses.
      const summarized = await summarizeResponses(results);
      setSummary(summarized);

      // Optionally simulate email notification.
      if (formData.receiveEmail && formData.email) {
        setEmailNotice(`The summary will be emailed to ${formData.email}.`);
      }
    } catch (err) {
      console.error("Error during submission:", err);
      setSummary("Error retrieving responses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6 mt-10">
      {/* Modal for detailed explanation of the process */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-[#181818] border border-[#2a2a2a] p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="mb-4">
              When you click the Submit button, your data is sent to multiple AI
              models for analysis. Their responses are collected and then
              summarized into a concise report so you can easily see if any of
              your sensitive information might have been included in training
              datasets. This transparency is key to building trust in the
              process.
            </p>
            <button
              onClick={() => setShowModal(false)}
              className="bg-[#5c5e49] text-white px-4 py-2 rounded hover:bg-[#22332d] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Two-column layout with a vertical divider */}
      <div className="flex flex-col md:flex-row">
        {/* LEFT COLUMN */}
        <div className="md:w-1/2 pr-8 border-r border-[#2a2a2a]">
          <div className="bg-[#181818] border border-[#2a2a2a] p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4 text-center">
              RIGHT TO KNOW
            </h1>
            <h2 className="text-xl font-semibold mb-2">WELCOME</h2>
            <p className="mb-4">
              <strong>WHY:</strong>
            </p>
            <p className="mb-4">
              <strong>WHAT:</strong>
            </p>
            <p className="mb-4">
              <strong>HOW:</strong>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block mb-1">
                  Email (for results delivery)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className="w-full p-2 border rounded bg-[#0f0f0f]"
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
              <fieldset className="border border-gray-600 p-4 rounded">
                <legend className="px-2">
                  Sensitive Information (Optional)
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
                    <label className="block mb-1">Parent(s)</label>
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
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:w-1/2 pl-8">
          <div className="bg-[#181818] border border-[#2a2a2a] p-8 rounded-lg shadow-md flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center">
                <HashLoader size={40} color="#5c5e49" />
                <p className="mt-4">Analyzing...</p>
              </div>
            ) : summary ? (
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-center">
                  Results:
                </h3>
                <div className="bg-[#2a2a2a] p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap">{summary}</pre>
                  {emailNotice && (
                    <p className="mt-2 text-green-300">{emailNotice}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <p>Awaiting submission...</p>
                <p>(fancy icon placeholder)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPage;
