import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Course,
  CourseWithProgress,
  UserCourseStatus,
} from "@/interfaces/course";

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
export const getStrapiMedia = (
  serverURL: string | null,
  imageURL: string | null,
) => {
  if (imageURL == null) return null;
  if (imageURL.startsWith("data:")) return imageURL;
  if (imageURL.startsWith("http") || imageURL.startsWith("//")) return imageURL;
  return serverURL + imageURL;
};

// Utility to format username (e.g., "alex.bennett" to "Alex Bennett")
export const formatUsername = (username: string | null): string => {
  if (!username) return "User"; // Fallback for null or undefined usernames
  return username
    .split(".") // Split by "."
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize each part
    .join(" "); // Join parts with a space
};

export function combineCourseDataWithProgress(
  courses: Course[],
  courseStatuses: UserCourseStatus[],
): CourseWithProgress[] {
  const courseStatusMap = new Map<string, UserCourseStatus>();

  courseStatuses.forEach((courseStatus) => {
    courseStatusMap.set(courseStatus.course.documentId, courseStatus);
  });

  return courses.map((course) => {
    const courseStatus = courseStatusMap.get(course.documentId);

    const totalModules =
      course.sections?.reduce(
        (count, section) => count + (section.modules?.length || 0),
        0,
      ) || 0;

    let completedModules = 0;

    if (courseStatus?.sections) {
      courseStatus.sections.forEach((sectionStatus) => {
        sectionStatus.modules.forEach((moduleStatus) => {
          if (moduleStatus.progress === 100) {
            completedModules += 1;
          }
        });
      });
    }

    const progress =
      totalModules > 0 ? (completedModules / totalModules) * 100 : 0;
    const isFavourite = !!courseStatus?.isFavourite;

    return {
      ...course,
      progress,
      isFavourite,
    };
  });
}
