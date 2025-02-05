import React, { useState } from "react";
import axios from "axios";
import { HashLoader } from "react-spinners";
import ChatSidebar from "./ChatSidebar";

const FormPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/api/submit",
        formData
      );
      if (response.status === 200) {
        setSuccess("Form submitted successfully!");
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (err) {
      setError("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <ChatSidebar />
      <div className="flex-1 flex flex-col justify-top items-top p-15 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center">Submit Information</h2>
        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-600 text-center">{error}</p>}
        {loading && (
          <div className="flex justify-center my-4">
            <HashLoader color="#007bff" size={30} />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Message:</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-blue-300"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            disabled={loading}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
