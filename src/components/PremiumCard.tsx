import React from "react";
import type { LucideIcon } from "lucide-react";

export type PremiumFeature = {
  icon: LucideIcon;
  label: string;
};

export type PremiumCardProps = {
  planName: string;
  price: number;
  features: PremiumFeature[];
  selected?: boolean;
  onSubscribe?: () => void;
};

const PremiumCard: React.FC<PremiumCardProps> = ({
  planName,
  price,
  features,
  selected = false,
  onSubscribe,
}) => {
  return (
    <div
      className={`flex flex-col justify-between rounded-2xl shadow-lg p-6 bg-gray-900 border transition-all duration-300 ${
        selected
          ? "border-primary scale-105 ring-2 ring-primary/40"
          : "border-gray-800 hover:border-primary/60"
      } min-w-[250px] max-w-xs mx-auto`}
    >
      <div>
        <h3 className="text-xl font-bold text-white mb-2 text-center">
          {planName}
        </h3>
        <div className="text-4xl font-extrabold text-primary mb-4 text-center">
          ${price}
        </div>
        <ul className="mb-6 space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-gray-200">
              <feature.icon size={20} className="text-primary" />
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={onSubscribe}
        className={`w-full py-2 rounded-full font-semibold transition text-white mt-2 ${
          selected
            ? "bg-primary shadow-lg hover:bg-primary/90"
            : "bg-gray-800 hover:bg-primary/80"
        }`}
      >
        Subscribe
      </button>
    </div>
  );
};

export default PremiumCard;
