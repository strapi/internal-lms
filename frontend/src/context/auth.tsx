import React, { createContext, useState, useEffect } from "react";
import {
  AuthContextType,
  AuthProviderProps,
  AuthState,
} from "@/interfaces/auth";
import { AUTH_KEY } from "@/lib/utils";
import { fetchAuthenticatedUser } from "@/lib/queries/appQueries";

const defaultState: AuthContextType = {
  authState: {
    loggedIn: false,
    token: null,
    username: null,
    userId: null,
  },
  setJwt: () => {},
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    loggedIn: false,
    token: null,
    username: null,
    userId: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(AUTH_KEY);
      if (token) {
        try {
          // Fetch the authenticated user
          const user = await fetchAuthenticatedUser();

          setAuthState({
            loggedIn: true,
            token: token,
            username: user.username,
            userId: user.id,
          });
        } catch (error) {
          console.error("Error initializing auth:", error);
        }
      }
    };

    initializeAuth();
  }, []);

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
        username: null,
        userId: null,
      });
    }
  };

  const login = (token: string) => {
    setJwt(token);
  };

  const logout = () => {
    setJwt(null);
  };

  return (
    <AuthContext.Provider value={{ authState, setJwt, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
