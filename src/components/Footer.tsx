// E:\fitarch-ai-app\src\components\Footer.tsx

import React from "react";
import { Mail, Phone, Youtube, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 pt-10 pb-4 px-4 md:px-0">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8 md:gap-0">
        {/* About Section */}
        <div className="flex-1 mb-8 md:mb-0">
          <h2 className="text-xl font-bold mb-3 text-white">About FitArch AI</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            FitArch AI is your intelligent fitness companion, offering personalized
            workout plans, progress tracking, and expert guidance to help you achieve
            your goals efficiently and safely.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex-1 mb-8 md:mb-0">
          <h2 className="text-xl font-bold mb-3 text-white">Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "Workouts", path: "/workouts" },
              { name: "Premium", path: "/premium" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <li key={link.name}>
                <a
                  href={link.path}
                  className="hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social */}
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-3 text-white">Contact & Social</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Mail size={18} className="text-primary" />
              <a
                href="mailto:support@fitarch.ai"
                className="hover:text-primary transition-colors"
              >
                support@fitarch.ai
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} className="text-primary" />
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                WhatsApp
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Youtube size={18} className="text-primary" />
              <a
                href="https://youtube.com/@fitarchai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                YouTube
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram size={18} className="text-primary" />
              <a
                href="https://instagram.com/fitarchai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Motivational Quote */}
      <div className="mt-10 text-center">
        <p className="italic text-lg text-primary font-semibold">
          "Level Up Your Body. One Rep at a Time."
        </p>
      </div>

      {/* Copyright */}
      <div className="mt-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} FitArch AI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
