import { AuthContextType } from "@/interfaces/auth";
import { createContext } from "react";

// TODO: BROKEN

const authContext: AuthContextType = {
  authState: {
    loggedIn: false,
    token: "",
  },
};

export const AuthContext = createContext<AuthContextType>(defaultState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // TODO: Implement the AuthProvider component

  // const loginAction

  return (
    // TODO: Provide the AuthContext value(s)
    <AuthContext.Provider>{children}</AuthContext.Provider>
  );
};
