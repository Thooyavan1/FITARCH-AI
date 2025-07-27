import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter both email and password.");
        setLoading(false);
        return;
      }

      // Simulate login (replace with real API in production)
      const user = { id: "1", name: email.split("@")[0], email };
      login(user);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          Welcome Back to FitArch AI
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-700 focus:outline-none focus:border-primary transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary hover:underline font-medium"
          >
            Register
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
