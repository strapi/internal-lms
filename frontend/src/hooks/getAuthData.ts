import { AUTH_KEY } from "@/lib/utils";

export const getAuthData: string | null = localStorage.getItem(AUTH_KEY);
