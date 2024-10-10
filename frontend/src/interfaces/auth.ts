export interface AuthPayloadType {
  userInfo: {
    email: string;
  };
  jwt: string;
}

export interface AuthContextType {
  authState: {
    loggedIn: boolean;
    token: string;
  };
  loginAction?(payload: AuthPayloadType): null;
  logOutAction?(): null;
}
