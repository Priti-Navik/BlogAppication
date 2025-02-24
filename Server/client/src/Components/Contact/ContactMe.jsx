import React, { useState } from "react";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { Alert } from "flowbite-react"; // Import Flowbite Alert

function ContactMe() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); // Success message state
  const [errorMsg, setErrorMsg] = useState(""); // Error message state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("/server/user/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", email: "", message: "" });
        setSuccessMsg("Thank you for your response! Your message has been received. 💌");
        
      } else {
        setErrorMsg("Failed to send your message. Please try again.");
      }
    } catch (error) {
      setErrorMsg("Something went wrong! Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-900 transition duration-300">
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl bg-white dark:bg-gray-800 p-6 md:p-12 rounded-lg shadow-lg">
        
        {/* Left - Contact Info */}
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Contact Me</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Feel free to reach out for collaborations, inquiries, or suggestions. I’d love to hear from you! 💌
          </p>
          <div className="space-y-4">
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <HiMail className="text-blue-500 text-xl" /> example@email.com
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <HiPhone className="text-green-500 text-xl" /> +91 98765 43210
            </p>
            <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <HiLocationMarker className="text-red-500 text-xl" /> Mumbai, India
            </p>
          </div>
        </div>

        {/* Right - Contact Form */}
        <div className="md:w-1/2 bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow">
          {successMsg && (
            <Alert color="green" onDismiss={() => setSuccessMsg("")}>
              {successMsg}
            </Alert>
          )}
          {errorMsg && (
            <Alert color="red" onDismiss={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white h-32"
            ></textarea>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white p-2 rounded-md hover:bg-purple-700 transition dark:bg-purple-500 dark:hover:bg-purple-400"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default ContactMe;
