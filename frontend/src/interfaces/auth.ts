import { Course, UserCourseStatus } from "@/interfaces/course";
/**
 * User interface
 */
export interface User {
  id: number;
  username: string;
  email: string;
  courseStatuses: UserCourseStatus[];
  favourites: Course[];
}

/**
 * Auth state interface to represent the authentication state
 */
export interface AuthState {
  loggedIn: boolean;
  token: string | null;
  user: User | null;
}

/**
 * Auth payload returned by login APIs
 */
export interface AuthPayloadType {
  userInfo: {
    id: number;
    username: string;
    email: string;
  };
  jwt: string;
}

/**
 * Auth context type
 */
export interface AuthContextType {
  authState: AuthState;
  actions: {
    setJwt: (token: string | null) => void;
    login: (token: string) => void;
    logout: () => void;
  };
}

/**
 * Props for the AuthProvider component
 */
export interface AuthProviderProps {
  children: React.ReactNode;
}
