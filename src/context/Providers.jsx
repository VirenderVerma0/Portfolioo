"use client";

import React, { Suspense } from "react";
import { AuthProvider } from "./AuthContext";
import { ToastProvider } from "./ToastContext";
import ApiProvider from "./ApiContext";

/**
 * Unified Providers Component
 * Wraps all context providers in a single component to ensure proper initialization order
 * and prevent context access before providers are mounted
 */
export const ProviderWrapper = ({ children }) => {
  return (
    <Suspense fallback={<div></div>}>
      <AuthProvider>
        <ToastProvider>
          <ApiProvider>
            {children}
          </ApiProvider>
        </ToastProvider>
      </AuthProvider>
    </Suspense>
  );
};

export default ProviderWrapper;
