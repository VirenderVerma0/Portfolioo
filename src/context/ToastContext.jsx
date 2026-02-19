"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

const defaultToastValue = {
  addToast: (message, type, duration) => {},
  removeToast: (id) => {},
};

const ToastContext = createContext(defaultToastValue);

export const useToast = () => {
  try {
    const ctx = useContext(ToastContext);
    if (!ctx || typeof ctx !== 'object') {
      if (typeof window !== 'undefined') {
        console.warn('ToastContext is invalid, using fallback values');
      }
      return { ...defaultToastValue };
    }
    return ctx;
  } catch (error) {
    if (typeof window !== 'undefined') {
      console.error('Error in useToast hook:', error);
    }
    return { ...defaultToastValue };
  }
};

let idCounter = 1;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = idCounter++;
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full px-4 py-2 rounded shadow-lg text-white transform transition-all duration-200 ${
              t.type === "success"
                ? "bg-green-600"
                : t.type === "error"
                ? "bg-red-600"
                : "bg-gray-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;
