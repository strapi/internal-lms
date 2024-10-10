import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AUTH_KEY = import.meta.env.AUTH_KEY ?? "jwt";
export const STRAPI_URL = import.meta.env.STRAPI_URL ?? "http://localhost:1337";

export const PROVIDERS = [
  {
    id: "google",
    label: "Sign in with Google",
  },
];

export const getStrapiMedia = (url: string | null) => {
  if (url === null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;

  return `${STRAPI_URL}${url}`;
};
