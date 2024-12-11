import React, { createContext, useState, useEffect } from "react";
import {
  AuthContextType,
  AuthProviderProps,
  AuthState,
  User,
} from "@/interfaces/auth";
import { AUTH_KEY } from "@/lib/utils";
import { fetchAuthenticatedUser } from "@/lib/queries/appQueries";

// Default state for the AuthContext
const defaultState: AuthContextType = {
  authState: {
    loggedIn: false,
    token: null,
    user: null,
  },
  actions: {
    setJwt: () => {},
    login: () => {},
    logout: () => {},
  },
};

export const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    loggedIn: false,
    token: null,
    user: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_KEY);
      if (token) {
        try {
          // Fetch authenticated user details
          const user: User = await fetchAuthenticatedUser();
          setAuthState({
            loggedIn: true,
            token,
            user, // Set the user object directly
          });
        } catch (error) {
          console.error("Error initializing auth:", error);
          localStorage.removeItem(AUTH_KEY);
          setAuthState({
            loggedIn: false,
            token: null,
            user: null,
          });
        }
      }
    };

    initializeAuth();
  }, []);

  // Function to set or clear the JWT
  const setJwt = (token: string | null) => {
    if (token) {
      localStorage.setItem(AUTH_KEY, token);
      setAuthState((prevState) => ({
        ...prevState,
        loggedIn: true,
        token,
      }));
    } else {
      localStorage.removeItem(AUTH_KEY);
      setAuthState({
        loggedIn: false,
        token: null,
        user: null,
      });
    }
  };

  // Login function to set the token
  const login = (token: string) => {
    setJwt(token);
  };

  // Logout function to clear everything and redirect
  const logout = () => {
    localStorage.clear();
    setAuthState({
      loggedIn: false,
      token: null,
      user: null,
    });
    window.location.assign("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        actions: {
          setJwt,
          login,
          logout,
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
