import { axiosInstance as axios } from "../network";
import qs from "qs";
import {
  Category,
  Course,
  CourseStatusInputData,
  UserCourseStatus,
} from "@/interfaces/course";
import { User as AuthUser } from "@/interfaces/auth";

export interface User extends AuthUser {
  courseStatuses?: UserCourseStatus[];
}
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
      fields: ["slug", "title", "description", "synopsis"],
      populate: {
        thumbnail: {
          populate: "*",
        },
        sections: {
          populate: {
            modules: {
              populate: "*",
            },
          },
        },
      },
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
        sections: {
          fields: ["documentId", "name"],
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
 * @returns {Promise<UserCourseStatus>} A promise that resolves to the user details.
 */
const fetchUserCourseStatuses = async (): Promise<User> => {
  const query = qs.stringify(
    {
      populate: {
        courseStatuses: {
          populate: {
            course: {
              fields: ["documentId"],
            },
            sections: {
              populate: {
                section: {
                  fields: ["documentId"],
                },
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
  return response.data;
};

/**
 * Creates or updates a course status for the authenticated user.
 * @param {Object} data - The data to send.
 * @param {CourseSimple} data.course - The course information.
 * @param {number} data.progress - The progress percentage (0–100).
 * @param {SectionStatus} data.section - The section and module progress data.
 * @returns {Promise<UserCourseStatus>} The response from the API.
 */
const createOrUpdateCourseStatus = async (
  data: CourseStatusInputData,
): Promise<UserCourseStatus> => {
  console.log("the data we're sending", data);

  const authenticatedUser = await fetchUserCourseStatuses();
  const userId = authenticatedUser.id;

  const existingCourseStatus = authenticatedUser.courseStatuses?.find(
    (status) => status.course?.documentId === data.course,
  );

  console.log("the existing course status", existingCourseStatus);

  if (existingCourseStatus) {
    console.log("a course status already exists");

    const statusDocumentId = existingCourseStatus.documentId;
    const updatedSections = [...(existingCourseStatus.sections || [])];

    console.log("the existing sections", updatedSections);

    // Handle sections and modules
    data.sections.forEach((newSection) => {
      const sectionIndex = updatedSections.findIndex(
        (section) =>
          section.section.documentId === newSection.sectionDocumentId,
      );

      if (sectionIndex > -1) {
        const section = updatedSections[sectionIndex];
        const modules = section.modules || [];

        newSection.modules.forEach((newModule) => {
          const moduleIndex = modules.findIndex(
            (mod) => mod.module?.documentId === newModule.moduleDocumentId,
          );

          if (moduleIndex > -1) {
            // Update existing module
            modules[moduleIndex].progress = newModule.progress;
          } else {
            // Add new module
            modules.push({
              module: { documentId: newModule.moduleDocumentId },
              progress: newModule.progress,
            });
          }
        });

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

    // Send the PUT request to update the course status
    const response = await axios.put(`/course-statuses/${statusDocumentId}`, {
      data: {
        course: data.course,
        user: userId,
        progress: data.progress,
        sections: updatedSections.map((section) => ({
          section: section.section.documentId,
          modules: section.modules.map((module) => ({
            module: module.module.documentId,
            progress: module.progress,
          })),
        })),
      },
    });
    return response.data;
  } else {
    // Create a new course status
    const response = await axios.post("/course-statuses", {
      data: {
        course: data.course,
        user: userId,
        progress: data.progress,
        sections: data.sections.map((section) => ({
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
