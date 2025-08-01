// src/pages/Register.tsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePremium } from "../context/PremiumContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Check, Crown, Star, Zap } from "lucide-react";

// Interfaces
interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  selectedPlan: "free" | "basic" | "pro" | "elite";
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

// Plans List
const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    features: ["Basic workouts", "Limited AI features"],
    icon: Star,
  },
  {
    id: "basic",
    name: "Basic",
    price: 3,
    features: ["Remove ads", "Voice Assistant access"],
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro",
    price: 4,
    features: ["All Basic features", "AI Video Assistant", "Priority Support"],
    icon: Crown,
  },
  {
    id: "elite",
    name: "Elite",
    price: 5,
    features: ["All Pro features", "Early Feature Access", "Personalized Plans"],
    icon: Crown,
  },
];

const Register: React.FC = () => {
  const { login } = useAuth();
  const { setPlan, confirmPlan } = usePremium();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    selectedPlan: "free",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validate Form
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Change
  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulate API

      const user = {
        id: Date.now().toString(),
        name: formData.fullName,
        email: formData.email,
      };

      login(user); // Call Auth Context

      if (formData.selectedPlan !== "free") {
        const planMap = { basic: 3, pro: 4, elite: 5 } as const;
        setPlan(planMap[formData.selectedPlan]);
        confirmPlan();
      }

      navigate("/dashboard");
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-bold text-primary mb-6 text-center">
          Create Your FitArch Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-gray-300 mb-2">Full Name</label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border ${
                errors.fullName ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:border-primary`}
              placeholder="John Doe"
              autoComplete="name"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border ${
                errors.email ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:border-primary`}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } focus:outline-none pr-12 focus:border-primary`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-white border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-700"
                } focus:outline-none pr-12 focus:border-primary`}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Plan Selection */}
          <div>
            <label className="block text-gray-300 mb-3">Choose Your Plan</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleInputChange("selectedPlan", plan.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer ${
                    formData.selectedPlan === plan.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-700 bg-gray-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex gap-2 items-center">
                      <plan.icon size={20} className="text-primary" />
                      <span className="text-white font-semibold">{plan.name}</span>
                    </div>
                    <span className="text-primary font-bold">
                      {plan.price === 0 ? "Free" : `$${plan.price}/mo`}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check size={14} className="text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2">
            <input
              id="agreeToTerms"
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
              className="w-4 h-4 mt-1 text-primary bg-gray-800 border-gray-700 rounded"
            />
            <label htmlFor="agreeToTerms" className="text-sm text-gray-300">
              I agree to the{" "}
              <a href="#" className="text-primary underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

          {/* Error Message */}
          {errors.general && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded">
              {errors.general}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
