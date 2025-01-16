import { AUTH_KEY } from "@/lib/utils";

export const getAuthData = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};
