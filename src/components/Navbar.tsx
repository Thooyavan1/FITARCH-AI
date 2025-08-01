// E:\fitarch-ai-app\src\components\Navbar.tsx

import React, { useState } from "react";
import { UserCircle, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Workouts", href: "/workouts" },
  { name: "Premium", href: "/premium", isButton: true },
  { name: "Contact", href: "/contact" },
];

const languages = [
  { code: "EN", label: "English" },
  { code: "TA", label: "Tamil" },
  { code: "HI", label: "Hindi" },
];

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lang, setLang] = useState("EN");

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <a
          href="/"
          className="text-2xl font-extrabold tracking-tight text-primary font-serif"
        >
          FitArch <span className="text-white">AI</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.isButton ? (
              <a
                key={link.name}
                href={link.href}
                className="bg-primary text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-primary/90 transition"
              >
                {link.name}
              </a>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="hover:text-primary transition font-medium"
              >
                {link.name}
              </a>
            )
          )}

          {/* Language Selector */}
          <select
            className="ml-4 bg-gray-800 text-gray-100 rounded px-2 py-1 focus:outline-none border border-gray-700"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            {languages.map((l) => (
              <option key={l.code} value={l.code}>
                {l.code}
              </option>
            ))}
          </select>

          {/* User Icon */}
          <UserCircle
            size={32}
            className="ml-4 text-gray-400 hover:text-primary cursor-pointer"
          />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-gray-100 focus:outline-none"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-4">
          <div className="flex flex-col gap-4 mt-4">
            {navLinks.map((link) =>
              link.isButton ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="bg-primary text-white px-4 py-2 rounded-full font-semibold shadow hover:bg-primary/90 transition text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary transition font-medium text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            )}

            {/* Language & User in Mobile */}
            <div className="flex items-center gap-2 mt-2">
              <label htmlFor="lang-mobile" className="text-sm text-gray-400">
                Lang:
              </label>
              <select
                id="lang-mobile"
                className="bg-gray-800 text-gray-100 rounded px-2 py-1 focus:outline-none border border-gray-700"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.code}
                  </option>
                ))}
              </select>
              <UserCircle
                size={28}
                className="ml-2 text-gray-400 hover:text-primary cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

