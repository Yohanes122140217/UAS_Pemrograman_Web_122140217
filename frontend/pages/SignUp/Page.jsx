// src/pages/SignUp/Page.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignUpPage() {
  const navigate = useNavigate();

  // 1️⃣ Redirect away if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = form;

    if (!username || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:6543/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (typeof data.error === "object" && data.error !== null) {
          const messages = Object.values(data.error).flat().join(" ");
          setError(messages || "Signup failed");
        } else {
          setError(data.error || "Signup failed");
        }
      } else {
        // success case
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Create Your Account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-5"
        noValidate
      >
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded">
            {message} You can now{" "}
            <Link to="/login" className="text-red-600 underline">
              log in
            </Link>
            .
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block mb-1 font-semibold text-gray-700"
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block mb-1 font-semibold text-gray-700"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block mb-1 font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter a strong password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block mb-1 font-semibold text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-red-600 font-semibold underline">
          Log In
        </Link>
      </p>
    </div>
  );
}

export default SignUpPage;
