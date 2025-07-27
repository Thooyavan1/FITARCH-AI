import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePremium } from "../context/PremiumContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Check, Crown, Star, Zap } from "lucide-react";

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
    features: [
      "All Pro features",
      "Early Feature Access",
      "Personalized Plans",
    ],
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

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms and Conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate API call for registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create user object
      const user = {
        id: Date.now().toString(),
        name: formData.fullName,
        email: formData.email,
      };

      // Login the user
      login(user);

      // Set premium plan if not free
      if (formData.selectedPlan !== "free") {
        const planMap = { basic: 3, pro: 4, elite: 5 } as const;
        setPlan(planMap[formData.selectedPlan as keyof typeof planMap]);
        confirmPlan();
      }

      // Redirect to dashboard
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border transition-colors ${
                errors.fullName
                  ? "border-red-500"
                  : "border-gray-700 focus:border-primary"
              } focus:outline-none`}
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              required
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border transition-colors ${
                errors.email
                  ? "border-red-500"
                  : "border-gray-700 focus:border-primary"
              } focus:outline-none`}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border transition-colors ${
                  errors.password
                    ? "border-red-500"
                    : "border-gray-700 focus:border-primary"
                } focus:outline-none pr-12`}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              className="block text-gray-300 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full px-4 py-3 rounded-lg bg-gray-800 text-gray-100 border transition-colors ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-700 focus:border-primary"
                } focus:outline-none pr-12`}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Confirm your password"
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
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
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.selectedPlan === plan.id
                      ? "border-primary bg-primary/10"
                      : "border-gray-700 bg-gray-800 hover:border-gray-600"
                  }`}
                  onClick={() => handleInputChange("selectedPlan", plan.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <plan.icon size={20} className="text-primary" />
                      <span className="font-semibold text-white">
                        {plan.name}
                      </span>
                    </div>
                    <span className="text-primary font-bold">
                      {plan.price === 0 ? "Free" : `$${plan.price}/month`}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check
                          size={14}
                          className="text-green-400 flex-shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {formData.selectedPlan === plan.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start gap-3">
            <input
              id="agreeToTerms"
              type="checkbox"
              className="mt-1 w-4 h-4 text-primary bg-gray-800 border-gray-700 rounded focus:ring-primary focus:ring-2"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                handleInputChange("agreeToTerms", e.target.checked)
              }
              required
            />
            <label htmlFor="agreeToTerms" className="text-gray-300 text-sm">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="text-red-500 text-sm text-center bg-red-500/10 p-3 rounded-lg">
              {errors.general}
            </div>
          )}

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={loading}
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

        <div className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:underline font-medium"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
