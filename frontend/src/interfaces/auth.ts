import { CourseStatusData } from "./course";

export interface AuthPayloadType {
  userInfo: {
    email: string;
  };
  jwt: string;
}

export interface AuthContextType {
  authState: AuthState;
  setJwt: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
}

// User interface
export interface User {
  id: number;
  username: string;
  email: string;
  courseStatuses?: CourseStatusData[];
}

export interface AuthState {
  loggedIn: boolean;
  token: string | null;
  username: string | null;
  userId: number | null;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
