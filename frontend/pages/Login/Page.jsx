// src/pages/Login/Page.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  // 1️⃣ Redirect away if already logged in
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const { email, password } = form;
    if (!email || !password) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:6543/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        redirect: "manual",
      });

      // handle Pyramid 302 redirect if you’re using it
      if (res.status === 302) {
        const redirectUrl = res.headers.get("Location");
        if (redirectUrl) {
          window.location.href = redirectUrl;
          return;
        }
      }

      const data = await res.json();

      if (res.ok && data.token) {
        // 2️⃣ store under the same key the rest of your app checks
        localStorage.setItem("token", data.token);
        localStorage.setItem('username', data.username);
        setMessage("Login successful!");
        navigate("/", { replace: true });
        console.log("token", data.token);
        console.log("username", data.username)
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Log In to Your Account
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6 space-y-5"
        noValidate
      >
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        {message && <div className="bg-green-100 text-green-700 p-3 rounded">{message}</div>}

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
            placeholder="you@example.com"
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
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-3 rounded font-semibold transition ${
            isLoading
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700 text-white"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-red-600 font-semibold underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
