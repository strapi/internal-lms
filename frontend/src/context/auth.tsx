import { AuthContextType } from "@/interfaces/auth";
import { createContext } from "react";

// TODO: Define the AuthContextType interface

const defaultState: AuthContextType = {
  loggedIn: false,
};

export const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: Implement the AuthProvider component

  return (
    // TODO: Provide the AuthContext value(s)
    <AuthContext.Provider value={defaultState}>{children}</AuthContext.Provider>
  );
};
