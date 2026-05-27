"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PortfolioDropdown from "@/components/PortfolioDropdown";

const Navbar = ({ name }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsMenuOpen(false);
    setIsActionsOpen(false);
  };

  const navItems = [
    { id: 1, label: "Home", href: "#intro" },
    { id: 2, label: "About Me", href: "#about" },
    { id: 3, label: "Skills", href: "#skills" },
    { id: 4, label: "Projects", href: "#projects" },
    { id: 5, label: "Experience", href: "#experience" },
    { id: 6, label: "Contact Me", href: "#contact" },
  ];

  return (
    <nav className="bg-transparent sticky top-0 backdrop-blur-md z-[9999] w-full text-gray-200 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Logo and Menu */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl sm:text-2xl font-sans font-bold flex-shrink-0">
            {name}
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4 lg:gap-10 relative">
            <div className="flex gap-4 lg:gap-6 items-center">
              {navItems.map((item) => (
                <a key={item.id} href={item.href}>
                  <div className="relative group cursor-pointer px-1 font-sans py-2 text-sm lg:text-lg text-white font-medium transition-all duration-300 hover:scale-105">
                    {item.label}

                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded"></span>
                  </div>
                </a>
              ))}

              {/* Arrow Button next to Contact Me */}
              <div className="relative">
                <button
                  onClick={() => setIsActionsOpen(!isActionsOpen)}
                  className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-800/50 transition-all"
                  title="Show/Hide actions"
                >
                  <svg
                    className={`w-5 h-5 transform transition-transform duration-300 ${isActionsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>

                {isActionsOpen && (
                  <>
                    
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsActionsOpen(false)}
                    ></div>
                      
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg z-20 border border-gray-700">
                      <div className="py-1">
                        {user ? (
                          <>
                            <div className="px-4 py-3">
                              <PortfolioDropdown
                                onClose={() => setIsActionsOpen(false)}
                              />
                            </div>
                            <button
                              onClick={handleLogout}
                              className="block w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              router.push("/signin");
                              setIsActionsOpen(false);
                            }}
                            className="block w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                          >
                            Sign In
                          </button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-200 hover:text-white hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-white transition-all"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1.5">
                <span
                  className={`block h-0.5 w-6 bg-current transform transition duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>

                <span
                  className={`block h-0.5 w-6 bg-current transition duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>

                <span
                  className={`block h-0.5 w-6 bg-current transform transition duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMenuOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <ul className="py-4 space-y-1 border-t border-gray-700/50 mt-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                <li className="px-4 py-3 text-base text-gray-200 font-medium hover:bg-gray-800/50 rounded-lg transition-colors">
                  {item.label}
                </li>
              </a>
            ))}
          </ul>

          {/* Mobile Extra Buttons */}
          <div className="px-4 py-4 border-t border-gray-700/50 flex flex-col gap-3">
            {user ? (
              <>
                <PortfolioDropdown
                  onClose={() => setIsMenuOpen(false)}
                />
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  router.push("/signin");
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors text-sm"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;