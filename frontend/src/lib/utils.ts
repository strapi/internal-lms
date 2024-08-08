import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const getStrapiURL = () => {
  return import.meta.env.STRAPI_URL ?? 'http:localhost:1337';
}

export const getStrapiMedia = (url: string | null) => {
  if(url === null) return null;
  if(url.startsWith('data:')) return url;
  if(url.startsWith('http') || url.startsWith('//')) return url;

  return `${getStrapiURL()}${url}`;
}
