import { createContext } from "react";

// TODO: Define the AuthContextType interface
export interface AuthContextType {}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: Implement the AuthProvider component

  return (
    // TODO: Provide the AuthContext value(s)
    <AuthContext.Provider value={null}>{children}</AuthContext.Provider>
  );
};
