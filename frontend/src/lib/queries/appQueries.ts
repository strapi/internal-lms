import { axiosInstance as axios } from "../network";
import qs from "qs";
import {
  Category,
  Course,
  CourseStatusInputData,
  UserCourseStatus,
  CourseWithProgress,
  SearchResults,
} from "@/interfaces/course";
import { User } from "@/interfaces/auth";
import { combineCourseDataWithProgress } from "../utils";

/**
 * Fetches categories from the Strapi API.
 * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const query = qs.stringify(
      { fields: ["documentId", "name", "description"] },
      { encodeValuesOnly: true },
    );
    const response = await axios.get(`/categories?${query}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Fetches courses from the Strapi API.
 * @returns {Promise<Course[]>} A promise that resolves to an array of courses.
 */
export const fetchCourses = async (): Promise<Course[]> => {
  try {
    const query = qs.stringify(
      {
        fields: ["slug", "title", "description", "synopsis"],
        populate: {
          thumbnail: { populate: "*" },
          categories: { populate: "*" },
          sections: {
            populate: {
              modules: { populate: "*" },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );
    const response = await axios.get(`/courses?${query}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export const fetchNewCourses = async (): Promise<Course[]> => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const query = qs.stringify(
      {
        filters: {
          createdAt: {
            $gte: oneMonthAgo.toISOString(), // Filter for courses created within the last month
          },
        },
        fields: ["slug", "title", "description", "synopsis"],
        populate: {
          thumbnail: { populate: "*" },
          categories: { populate: "*" },
          sections: {
            populate: {
              modules: { populate: "*" },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await axios.get(`/courses?${query}`);

    return response.data.data;
  } catch (error) {
    console.error("Error fetching new courses:", error);
    throw error;
  }
};

/**
 * Fetches a single course by its slug.
 * @param {string} slug - The slug of the course to fetch.
 * @returns {Promise<Course>} A promise that resolves to the course data.
 */
export const fetchCourseBySlug = async (slug: string): Promise<Course> => {
  try {
    const query = qs.stringify(
      {
        filters: { slug: { $eq: slug } },
        fields: ["title", "description", "slug", "documentId"],
        populate: {
          thumbnail: {
            fields: ["url", "alternativeText", "caption", "width", "height"],
          },
          categories: { fields: ["id", "name", "description"] },
          sections: {
            fields: ["documentId", "name", "description"],
            populate: {
              modules: {
                fields: ["documentId", "title", "description"],
                populate: {
                  media: {
                    fields: [
                      "id",
                      "title",
                      "playback_id",
                      "asset_id",
                      "duration",
                      "isReady",
                    ],
                  },
                },
              },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await axios.get(`/courses?${query}`);
    const courseData = response.data.data[0];

    if (!courseData) {
      throw new Error(`Course with slug '${slug}' not found.`);
    }

    return courseData;
  } catch (error) {
    console.error(`Error fetching course with slug '${slug}':`, error);
    throw error;
  }
};

/**
 * Fetches the authenticated user's details.
 * @returns {Promise<User>} A promise that resolves to the user details.
 */
export const fetchAuthenticatedUser = async (): Promise<User> => {
  try {
    const response = await axios.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    throw error;
  }
};

/**
 * Fetches the authenticated user's details, including course statuses.
 * @returns {Promise<User>} A promise that resolves to the user details.
 */
export const fetchUserData = async (): Promise<User> => {
  try {
    const query = qs.stringify(
      {
        populate: {
          courseStatuses: {
            populate: {
              fields: ["isFavourite"],
              course: { fields: ["documentId"] },
              sections: {
                populate: {
                  section: { fields: ["documentId"] },
                  modules: { populate: { module: { fields: ["documentId"] } } },
                },
              },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await axios.get(`/users/me?${query}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

/**
 * Creates or updates a course status for the authenticated user.
 * @param {CourseStatusInputData} data - Data to create or update the course status.
 * @returns {Promise<UserCourseStatus>} The updated or created course status.
 */
export const createOrUpdateCourseStatus = async (
  data: CourseStatusInputData,
): Promise<UserCourseStatus> => {
  try {
    const user = await fetchUserData();
    const existingStatus = user.courseStatuses?.find(
      (status) => status.course.documentId === data.course,
    );

    const updatedSections = existingStatus?.sections
      ? [...existingStatus.sections]
      : [];

    // If there are new sections to update, merge them with the existing ones
    if (data.sections) {
      data.sections.forEach((newSection) => {
        const sectionIndex = updatedSections.findIndex(
          (existingSection) =>
            existingSection.section.documentId === newSection.sectionDocumentId,
        );

        if (sectionIndex > -1) {
          // Update existing section
          const section = updatedSections[sectionIndex];
          const modules = section.modules || [];

          // Merge modules
          newSection.modules.forEach((newModule) => {
            const moduleIndex = modules.findIndex(
              (mod) => mod.module.documentId === newModule.moduleDocumentId,
            );

            if (moduleIndex > -1) {
              // Update progress for existing module
              modules[moduleIndex].progress = newModule.progress;
            } else {
              // Add new module
              modules.push({
                module: { documentId: newModule.moduleDocumentId },
                progress: newModule.progress,
              });
            }
          });

          // Update the section modules
          section.modules = modules;
        } else {
          // Add new section
          updatedSections.push({
            section: { documentId: newSection.sectionDocumentId },
            modules: newSection.modules.map((mod) => ({
              module: { documentId: mod.moduleDocumentId },
              progress: mod.progress,
            })),
          });
        }
      });
    }

    // Prepare the request body
    const requestBody = {
      course: data.course,
      user: user.id,
      progress: data.progress ?? (existingStatus?.progress || 0),
      isFavourite: data.isFavourite ?? (existingStatus?.isFavourite || false),
      sections: updatedSections.map((section) => ({
        section: section.section.documentId,
        modules: section.modules.map((module) => ({
          module: module.module.documentId,
          progress: module.progress,
        })),
      })),
    };

    // Update or create course status
    const response = existingStatus
      ? await axios.put(`/course-statuses/${existingStatus.documentId}`, {
          data: requestBody,
        })
      : await axios.post("/course-statuses", { data: requestBody });

    return response.data;
  } catch (error) {
    console.error("Error creating or updating course status:", error);
    throw error;
  }
};

export async function fetchProcessedCourses(): Promise<CourseWithProgress[]> {
  const [user, courses] = await Promise.all([fetchUserData(), fetchCourses()]);
  const userCourseStatuses = user?.courseStatuses || [];
  return combineCourseDataWithProgress(courses, userCourseStatuses);
}

/**
 * Fetches courses with the same categories as the given course.
 * @param {number[]} categoryIds - The IDs of the categories to match.
 * @returns {Promise<Course[]>} A promise that resolves to an array of courses.
 */
export const fetchCoursesByCategory = async (
  categoryIds: number[],
  excludeDocumentId: string,
): Promise<CourseWithProgress[]> => {
  try {
    const query = qs.stringify(
      {
        filters: {
          categories: {
            id: {
              $in: categoryIds,
            },
          },
          documentId: {
            $ne: excludeDocumentId,
          },
        },
        fields: ["slug", "title", "description", "synopsis"],
        populate: {
          thumbnail: { populate: "*" },
          categories: { populate: "*" },
          sections: {
            populate: {
              modules: { populate: "*" },
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await axios.get(`/courses?${query}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching courses by category:", error);
    throw error;
  }
};

export const searchQuery = async (searchQuery: string) => {
  try {
    const query = qs.stringify({
      _q: searchQuery,
      populate: {
        thumbnail: { populate: "*" },
        categories: { populate: "*" },
      },
      fields: ["slug", "title", "description", "synopsis"],
    });

    const response = await axios.get(`/courses?${query}`);
    return {
      courses: response.data.data,
    };
  } catch (error) {
    console.error("Error performing search:", error);
    throw error;
  }
};
