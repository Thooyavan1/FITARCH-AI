import React from "react";
import { useAuth } from "../context/AuthContext";
import { usePremium } from "../context/PremiumContext";
import PremiumCard, { type PremiumFeature } from "../components/PremiumCard";
import VoiceAssistant from "../components/VoiceAssistant";
import VideoPlayer from "../components/VideoPlayer";
import { Dumbbell, Star, ShieldCheck, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

type Plan = {
  planName: string;
  price: number;
  features: PremiumFeature[];
  value: 3 | 4 | 5;
};

const premiumPlans: Plan[] = [
  {
    planName: "Starter",
    price: 249,
    features: [
      { icon: Dumbbell, label: "Basic Workouts" },
      { icon: Star, label: "AI Recommendations" },
      { icon: ShieldCheck, label: "Progress Tracking" },
    ],
    value: 3,
  },
  {
    planName: "Pro",
    price: 349,
    features: [
      { icon: Dumbbell, label: "All Starter Features" },
      { icon: Zap, label: "Priority Support" },
      { icon: Star, label: "Advanced Analytics" },
      { icon: ShieldCheck, label: "Personalized Plans" },
    ],
    value: 4,
  },
  {
    planName: "Elite",
    price: 449,
    features: [
      { icon: Dumbbell, label: "All Pro Features" },
      { icon: Trophy, label: "1-on-1 Coaching" },
      { icon: Star, label: "Exclusive Content" },
      { icon: ShieldCheck, label: "Early Access Features" },
    ],
    value: 5,
  },
];

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { selectedPlan, setPlan, confirmPlan, isPremiumActive } = usePremium();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-400">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 py-8 px-4 md:px-8 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
          Welcome, {user?.name || user?.email || "User"}!
        </h1>
        <p className="text-gray-400 mb-8">
          This is your FitArch AI dashboard. Track your progress, access premium features, and more.
        </p>

        {/* Premium Plans */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {premiumPlans.map((plan) => (
            <PremiumCard
              key={plan.planName}
              planName={plan.planName}
              price={plan.price}
              features={plan.features}
              selected={selectedPlan === plan.value}
              onSubscribe={() => setPlan(plan.value)}
            />
          ))}
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <button
            className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-primary/90 transition text-lg"
            onClick={confirmPlan}
            disabled={isPremiumActive || !selectedPlan}
          >
            {isPremiumActive ? "Premium Active" : "Upgrade to Premium"}
          </button>
          {isPremiumActive && selectedPlan && (
            <span className="text-green-400 font-semibold">
              Premium Plan: ₹
              {premiumPlans.find((p) => p.value === selectedPlan)?.price}
            </span>
          )}
        </div>

        {/* AI Assistant and Video Player */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="grid md:grid-cols-2 gap-8"
        >
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-primary mb-4">AI Voice Assistant</h2>
            <VoiceAssistant />
          </div>

          <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-primary mb-4">Workout Video</h2>
            <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

