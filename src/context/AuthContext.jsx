"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Default context value to prevent undefined destructuring
const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => ({ success: false, error: 'Auth context not initialized' }),
  register: async () => ({ success: false, error: 'Auth context not initialized' }),
  logout: () => {},
  updateUser: () => {},
  isAdmin: () => false,
});

export const useAuth = () => {
  try {
    const context = useContext(AuthContext);
    // Return context with fallback to default values if somehow undefined
    if (!context) {
      console.warn('AuthContext is undefined, returning default values');
      return {
        user: null,
        loading: true,
        login: async () => ({ success: false, error: 'Auth context not initialized' }),
        register: async () => ({ success: false, error: 'Auth context not initialized' }),
        logout: () => {},
        updateUser: () => {},
        isAdmin: () => false,
      };
    }
    return context;
  } catch (error) {
    console.error('Error accessing AuthContext:', error);
    return {
      user: null,
      loading: true,
      login: async () => ({ success: false, error: 'Auth context not initialized' }),
      register: async () => ({ success: false, error: 'Auth context not initialized' }),
      logout: () => {},
      updateUser: () => {},
      isAdmin: () => false,
    };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyToken = useCallback(async (token) => {
    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Token is invalid or expired
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check authentication status on component mount
    const checkAuthStatus = async () => {
      try {
        // Only access localStorage on client side
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          if (token) {
            await verifyToken(token);
          } else {
            setLoading(false);
          }
        } else {
          // Server-side: skip auth check
          setLoading(false);
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [verifyToken]);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store token securely
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', data.token);
        }
        
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        return { 
          success: false, 
          error: errorData.error || 'Registration failed' 
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection.' 
      };
    }
  };

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    // Optional: Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, []);

  const updateUser = useCallback((updatedUserData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUserData
    }));
  }, []);

  const isAdmin = useCallback(() => {
    return user && user.role === 'admin';
  }, [user]);

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional: Custom hook for easier user access
export const useUser = () => {
  const { user, loading } = useAuth();
  return { user, loading };
};

// Optional: Custom hook for authentication status
export const useAuthStatus = () => {
  const { user, loading } = useAuth();
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user,
  };
};