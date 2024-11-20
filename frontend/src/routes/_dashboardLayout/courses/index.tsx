import { useEffect, useState } from "react";
import qs from "qs";
import { createFileRoute } from "@tanstack/react-router";
import { CourseCards } from "@/components/CourseCards";
import { Category, Course } from "@/interfaces/course";

const API_URL = import.meta.env.VITE_STRAPI_API_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_KEY;

if (!API_URL || !API_TOKEN) {
  throw new Error("API_URL or API_TOKEN is missing. Check your .env file.");
}

interface StrapiResponse<T> {
  data: T[];
}

export const Route = createFileRoute("/_dashboardLayout/courses/")({
  component: () => <CoursesPage />,
});

export const CoursesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const query = qs.stringify(
        {
          fields: ["documentId", "title", "description"],
        },
        { encodeValuesOnly: true },
      );

      try {
        const response = await fetch(`${API_URL}/categories?${query}`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch categories:", response.statusText);
          return;
        }

        const { data }: StrapiResponse<Category> = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchCourses = async () => {
      const query = qs.stringify(
        {
          fields: ["documentId", "title", "description"],
          populate: "*",
        },
        { encodeValuesOnly: true },
      );

      try {
        const response = await fetch(`${API_URL}/courses?${query}`, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch courses:", response.statusText);
          return;
        }

        const { data }: StrapiResponse<Course> = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCategories();
    fetchCourses();
  }, []);

  const filteredCourses = selectedCategory
    ? courses.filter((course) =>
        course.categories.some((category) => category.id === selectedCategory),
      )
    : courses;

    console.log(filteredCourses);

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-5">
      {/* Categories List */}
      <div className="order-1 space-y-4 rounded-lg bg-gray-100 p-6 shadow-md md:order-2 md:col-span-1">
        <h2 className="mb-4 text-xl font-bold">Categories</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full rounded-lg p-2 text-left ${
                selectedCategory === null
                  ? "bg-blue-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              Show All
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full rounded-lg p-2 text-left ${
                  selectedCategory === category.id
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                }`}
              >
                {category.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* CourseCards */}
      <div className="order-2 md:order-1 md:col-span-4">
        <CourseCards courses={filteredCourses} showProgress={false} />
      </div>
    </div>
  );
};

export default CoursesPage;
