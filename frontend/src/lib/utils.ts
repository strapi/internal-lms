import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and tailwind-merge.
 * @param {...ClassValue[]} inputs - The class names to merge.
 * @returns {string} The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AUTH_KEY = import.meta.env.VITE_AUTH_KEY ?? "jwt";
export const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL ?? "http://localhost:1337";

export const PROVIDERS = [
  {
    id: "google",
    label: "Sign in with Google",
  },
];

/**
 * Constructs the full URL for Strapi media assets.
 * @param {string | null} url - The media URL.
 * @returns {string | null} The full media URL or null.
 */
export const getStrapiMedia = (url: string | null) => {
  if (url === null) return null;
  if (url.startsWith("data:")) return url;
  if (url.startsWith("http") || url.startsWith("//")) return url;

  return `${STRAPI_URL}${url}`;
};

// Utility to format username (e.g., "alex.bennett" to "Alex Bennett")
export const formatUsername = (username: string | null): string => {
  if (!username) return "User"; // Fallback for null or undefined usernames
  return username
    .split(".") // Split by "."
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize each part
    .join(" "); // Join parts with a space
};
