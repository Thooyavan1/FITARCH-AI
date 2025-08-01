import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Check, Star, Zap, Shield, Crown, Sparkles,
  Globe, IndianRupee
} from "lucide-react";
import { usePremium } from "../context/PremiumContext";

interface PlanFeature {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

interface PlanData {
  name: string;
  priceUSD: number;
  priceINR: number;
  value: 3 | 4 | 5;
  popular?: boolean;
  features: PlanFeature[];
}

const plans: PlanData[] = [
  {
    name: "Basic",
    priceUSD: 5,
    priceINR: 249,
    value: 3,
    features: [
      { icon: Check, label: "Remove ads" },
      { icon: Star, label: "Voice Assistant access" },
    ],
  },
  {
    name: "Pro",
    priceUSD: 8,
    priceINR: 349,
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
    priceUSD: 11,
    priceINR: 499,
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
  const { setPlan } = usePremium();
  const [country, setCountry] = useState("IN");

  useEffect(() => {
    const lang = navigator.language;
    if (lang.includes("en-US") || lang.includes("en-GB")) {
      setCountry("US");
    } else {
      setCountry("IN");
    }
  }, []);

  const handleSubscribe = (value: 3 | 4 | 5) => {
    setPlan(value);
    navigate("/confirm-payment");
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-center text-4xl md:text-5xl font-extrabold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Choose Your Premium Plan
        </motion.h1>

        <p className="text-center text-gray-400 mb-10 text-lg">
          Detected Country: <span className="text-primary font-semibold">{country}</span>
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`relative bg-gray-900 p-8 rounded-2xl border-2 transition-all ${
                plan.popular
                  ? "border-primary scale-105 shadow-xl"
                  : "border-gray-800 hover:border-primary/50"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
              <div className="flex justify-center items-baseline gap-2 mb-6">
                <span className="text-4xl font-extrabold text-primary">
                  {country === "IN" ? `₹${plan.priceINR}` : `$${plan.priceUSD}`}
                </span>
                <span className="text-gray-400 text-sm">/month</span>
              </div>

              <ul className="space-y-4 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <feature.icon className="text-primary" size={20} />
                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.value)}
                className={`w-full py-3 rounded-full font-semibold transition-all ${
                  plan.popular
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-800 text-white hover:bg-primary/70"
                }`}
              >
                {country === "IN" ? (
                  <>
                    <IndianRupee className="inline mr-2" size={18} />
                    Pay via GPay / UPI
                  </>
                ) : (
                  <>
                    <Globe className="inline mr-2" size={18} />
                    Pay via PayPal
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Manual note for India */}
        {country === "IN" && (
          <div className="text-center text-gray-400 text-sm mt-8">
            <p>Manual UPI ID: <span className="text-primary font-mono">thoo1234yavan56789-2@okicici</span></p>
            <p>Send payment screenshot to support if auto-confirmation fails.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumPlans;
