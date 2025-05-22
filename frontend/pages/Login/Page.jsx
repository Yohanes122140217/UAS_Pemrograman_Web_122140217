import { useState } from "react";
import { Link } from "react-router-dom";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // TODO: Replace with real login API call
    if (email === "user@example.com" && password === "password123") {
      setSuccess(true);
      setError("");
      setFormData({ email: "", password: "" });
    } else {
      setError("Invalid email or password.");
      setSuccess(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Log In to Your Account</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-5" noValidate>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 p-3 rounded">Login successful!</div>}

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-semibold transition"
        >
          Log In
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-red-600 font-semibold underline">Sign Up</Link>
      </p>
    </div>
  );
}

export default LoginPage;
