import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-6xl md:text-8xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-primary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors"
        >
          Go to Home
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
