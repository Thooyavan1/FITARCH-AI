import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePremium } from "../context/PremiumContext";
import { Check, Star, Zap, Shield, Crown, Sparkles } from "lucide-react";

interface PlanFeature {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

interface PlanData {
  name: string;
  price: number;
  features: PlanFeature[];
  value: 3 | 4 | 5;
  popular?: boolean;
}

const plans: PlanData[] = [
  {
    name: "Basic",
    price: 3,
    value: 3,
    features: [
      { icon: Check, label: "Remove ads" },
      { icon: Star, label: "Voice Assistant access" },
    ],
  },
  {
    name: "Pro",
    price: 4,
    value: 4,
    popular: true,
    features: [
      { icon: Check, label: "All Basic features" },
      { icon: Zap, label: "AI Video Assistant" },
      { icon: Shield, label: "Priority Support" },
    ],
  },
  {
    name: "Elite",
    price: 5,
    value: 5,
    features: [
      { icon: Check, label: "All Pro features" },
      { icon: Crown, label: "Early Feature Access" },
      { icon: Sparkles, label: "Personalized Plans" },
    ],
  },
];

const PremiumPlans: React.FC = () => {
  const navigate = useNavigate();
  const { setPlan, confirmPlan } = usePremium();

  const handleSubscribe = (planValue: 3 | 4 | 5) => {
    setPlan(planValue);
    confirmPlan();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Choose Your Premium Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Unlock the full potential of FitArch AI with our premium features
            designed to enhance your fitness journey.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className={`relative bg-gray-900 rounded-2xl p-8 border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-primary shadow-2xl shadow-primary/20 scale-105"
                  : "border-gray-800 hover:border-primary/60"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-primary">
                    ${plan.price}
                  </span>
                  <span className="text-gray-400">/month</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: 0.5 + featureIndex * 0.1,
                    }}
                    className="flex items-center gap-3 text-gray-200"
                  >
                    <feature.icon
                      size={20}
                      className="text-primary flex-shrink-0"
                    />
                    <span className="text-sm">{feature.label}</span>
                  </motion.li>
                ))}
              </ul>

              {/* Subscribe Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubscribe(plan.value)}
                className={`w-full py-3 px-6 rounded-full font-semibold transition-all duration-300 ${
                  plan.popular
                    ? "bg-primary text-white shadow-lg hover:bg-primary/90 hover:shadow-xl"
                    : "bg-gray-800 text-white hover:bg-primary/80 hover:shadow-lg"
                }`}
              >
                Subscribe Now
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm">
            All plans include a 7-day free trial. Cancel anytime.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPlans;
