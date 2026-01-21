"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const PortfolioDropdown = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const options = [
    { id: "skills", label: "Manage Skills", path: "/manage/skills" },
    { id: "profile", label: "Manage Profile", path: "/manage/profile" },
    { id: "projects", label: "Manage Projects", path: "/manage/projects" },
    { id: "experience", label: "Manage Experience", path: "/manage/experience" },
  ];

  const handleOptionClick = (path) => {
    router.push(path);
    setIsOpen(false);
    onClose();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors flex items-center gap-2"
      >
        Manage Portfolio
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-md shadow-lg z-20 border border-gray-700">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.path)}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-200 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PortfolioDropdown;
