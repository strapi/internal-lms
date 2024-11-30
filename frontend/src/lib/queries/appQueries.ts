import { axiosInstance as axios } from "../network";
import qs from "qs";
import { Category, Course, CourseStatusData } from "@/interfaces/course";
import { User } from "@/interfaces/auth";

const fetchHomePageData = async () => {
  return axios.get("/courses");
};

/**
 * Fetches categories from the Strapi API.
 * @returns {Promise<Category[]>} A promise that resolves to an array of categories.
 */
const fetchCategories = async (): Promise<Category[]> => {
  const query = qs.stringify(
    {
      fields: ["documentId", "title", "description"],
    },
    { encodeValuesOnly: true },
  );

  const response = await axios.get(`/categories?${query}`);
  return response.data.data;
};

/**
 * Fetches courses from the Strapi API.
 * @returns {Promise<Course[]>} A promise that resolves to an array of courses.
 */
const fetchCourses = async (): Promise<Course[]> => {
  const query = qs.stringify(
    {
      fields: ["slug", "title", "description"],
      populate: "*",
    },
    { encodeValuesOnly: true },
  );

  const response = await axios.get(`/courses?${query}`);
  return response.data.data;
};

/**
 * Fetches a single course by its ID from the Strapi API.
 * @param {string} slug - The slug of the course to fetch.
 * @returns {Promise<Course>} A promise that resolves to the course data.
 */
const fetchCourseBySlug = async (slug: string): Promise<Course> => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      fields: ["title", "description", "slug", "documentId"],
      populate: {
        thumbnail: {
          fields: ["url", "alternativeText", "caption", "width", "height"],
        },
        categories: {
          fields: ["id", "title", "description"],
        },
        section: {
          fields: ["documentId", "name"],
          populate: {
            modules: {
              fields: ["documentId", "title"],
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
};

/**
 * Fetches the current authenticated user's details.
 * @returns {Promise<User>} A promise that resolves to the user details.
 */
const fetchAuthenticatedUser = async (): Promise<User> => {
  const response = await axios.get("/users/me");
  return response.data;
};

/**
 * Fetches the current authenticated user's details, including courseStatuses.
 * @returns {Promise<User & { courseStatuses: CourseStatusData[] }>} A promise that resolves to the user details.
 */
const fetchUserCourseStatuses = async (): Promise<
  User & { courseStatuses: CourseStatusData[] }
> => {
  const query = qs.stringify(
    {
      populate: {
        courseStatuses: {
          populate: {
            course: {
              fields: ["documentId"],
            },
            section: {
              populate: {
                modules: {
                  populate: {
                    module: {
                      fields: ["documentId"],
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const response = await axios.get(`/users/me?${query}`);
  return response.data; // Ensure response.data contains the user data with courseStatuses
};

/**
 * Creates or updates a course status for the authenticated user.
 * @param {Object} data - The data to send.
 * @param {CourseSimple} data.course - The course information.
 * @param {number} data.progress - The progress percentage (0–100).
 * @param {SectionStatus} data.section - The section and module progress data.
 * @returns {Promise<CourseStatusData>} The response from the API.
 */
const createOrUpdateCourseStatus = async (
  data: CourseStatusData,
): Promise<CourseStatusData> => {
  // Fetch the authenticated user with preloaded courseStatuses
  const authenticatedUser = await fetchUserCourseStatuses();
  const userId = authenticatedUser.id;

  // Check if a course status exists for the provided course
  const existingCourseStatus = authenticatedUser.courseStatuses?.find(
    (status) => status.courseDocumentId === data.courseDocumentId,
  );

  if (existingCourseStatus) {
    // Update the existing course status
    const statusId = existingCourseStatus.id!;
    const updatedSections = [...(existingCourseStatus.section || [])];

    // Handle sections and modules
    data.section.forEach((newSection) => {
      const sectionIndex = updatedSections.findIndex(
        (section) => section.sectionDocumentId === newSection.sectionDocumentId,
      );

      if (sectionIndex > -1) {
        // Section exists, update its modules
        const section = updatedSections[sectionIndex];
        const modules = section.modules || [];

        newSection.modules.forEach((newModule) => {
          const moduleIndex = modules.findIndex(
            (mod) => mod.moduleDocumentId === newModule.moduleDocumentId,
          );

          if (moduleIndex > -1) {
            // Update existing module
            modules[moduleIndex].progress = newModule.progress;
          } else {
            // Add new module
            modules.push({
              moduleDocumentId: newModule.moduleDocumentId,
              progress: newModule.progress,
            });
          }
        });

        section.modules = modules;
      } else {
        // Add new section
        updatedSections.push({
          sectionDocumentId: newSection.sectionDocumentId,
          modules: newSection.modules.map((mod) => ({
            moduleDocumentId: mod.moduleDocumentId,
            progress: mod.progress,
          })),
        });
      }
    });

    // Send the PUT request to update the course status
    const response = await axios.put(`/course-statuses/${statusId}`, {
      data: {
        course: data.courseDocumentId,
        progress: data.progress,
        section: updatedSections.map((section) => ({
          section: section.sectionDocumentId,
          modules: section.modules.map((module) => ({
            module: module.moduleDocumentId,
            progress: module.progress,
          })),
        })),
      },
    });

    return response.data;
  } else {
    console.log("the data for course status", data);
    // Create a new course status
    const response = await axios.post("/course-statuses", {
      data: {
        course: data.courseDocumentId,
        user: userId,
        progress: data.progress,
        section: data.section.map((section) => ({
          section: section.sectionDocumentId,
          modules: section.modules.map((module) => ({
            module: module.moduleDocumentId,
            progress: module.progress,
          })),
        })),
      },
    });

    return response.data;
  }
};

export {
  fetchAuthenticatedUser,
  fetchUserCourseStatuses,
  fetchCategories,
  fetchCourses,
  fetchHomePageData,
  fetchCourseBySlug,
  createOrUpdateCourseStatus,
};
