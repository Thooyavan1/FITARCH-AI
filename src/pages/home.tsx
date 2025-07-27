import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VoiceAssistant from "../components/VoiceAssistant";
import VideoPlayer from "../components/VideoPlayer";
import PremiumCard, { type PremiumFeature } from "../components/PremiumCard";
import { Dumbbell, Star, ShieldCheck, Zap, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const premiumPlans = [
  {
    planName: "Starter",
    price: 249,
    features: [
      { icon: Dumbbell, label: "Basic Workouts" },
      { icon: Star, label: "AI Recommendations" },
      { icon: ShieldCheck, label: "Progress Tracking" },
    ] as PremiumFeature[],
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
    ] as PremiumFeature[],
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
    ] as PremiumFeature[],
    value: 5,
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-950 min-h-screen flex flex-col">
      <Navbar />
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center justify-center text-center py-16 px-4 md:px-0"
      >
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary mb-4">
          Level Up Your Fitness Journey with FitArch AI
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
          Voice-guided workouts, AI nutrition, and premium progression plans
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-primary/90 transition text-lg"
            onClick={() => navigate("/dashboard")}
          >
            Get Started
          </button>
          <button
            className="bg-gray-800 text-primary px-8 py-3 rounded-full font-bold shadow hover:bg-primary/10 border border-primary transition text-lg"
            onClick={() => {
              const el = document.getElementById("premium-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Premium
          </button>
        </div>
      </motion.section>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto w-full flex-1">
        <motion.section
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-3 gap-8 py-12 px-4"
        >
          {/* AI Voice Coach */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-primary mb-4">
              AI Voice Coach
            </h2>
            <VoiceAssistant />
          </div>
          {/* Video Workout Upload */}
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <h2 className="text-xl font-bold text-primary mb-4">
              Video Workout Upload
            </h2>
            <VideoPlayer src="https://www.w3schools.com/html/mov_bbb.mp4" />
          </div>
          {/* Premium Benefits */}
          <div
            id="premium-section"
            className="bg-gray-900 rounded-xl p-6 shadow-lg flex flex-col items-center"
          >
            <h2 className="text-xl font-bold text-primary mb-4">
              Premium Benefits
            </h2>
            <div className="flex flex-col gap-6 md:flex-row md:gap-4">
              {premiumPlans.map((plan) => (
                <PremiumCard
                  key={plan.planName}
                  planName={plan.planName}
                  price={plan.price}
                  features={plan.features}
                  selected={false}
                />
              ))}
            </div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
