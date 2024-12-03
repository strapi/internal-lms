import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CourseCards } from "@/components/CourseCards";
import { createFileRoute } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  fetchCategories,
  fetchProcessedCourses,
} from "@/lib/queries/appQueries";

export const Route = createFileRoute("/_dashboardLayout/courses/")({
  component: () => <CoursesPage />,
});

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: processedCourses = [],
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["processedCourses"],
    queryFn: fetchProcessedCourses,
  });

  if (isCategoriesLoading || isCoursesLoading) {
    return <div>Loading...</div>;
  }

  if (categoriesError) {
    return <div>Error loading categories: {categoriesError.message}</div>;
  }

  if (coursesError) {
    return <div>Error loading courses: {coursesError.message}</div>;
  }

  const filteredCourses = processedCourses.filter((course) => {
    if (showFavorites && !course.isFavourite) return false;
    if (selectedCategory) {
      return course.categories.some(
        (category) => category.id === selectedCategory,
      );
    }
    return true;
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      {/* Filters */}
      <div className="order-1 space-y-4 rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800 md:order-2 md:col-span-1">
        <div className="mb-6">
          <button
            onClick={() => setShowFavorites((prev) => !prev)}
            className={cn(
              "w-full rounded-lg p-2 text-left",
              showFavorites
                ? "bg-yellow-500 text-white"
                : "bg-white text-black",
            )}
          >
            {showFavorites ? "Show All Courses" : "Show Favorites"}
          </button>
        </div>

        <h2 className="mb-4 text-xl font-bold">Categories</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "w-full rounded-lg p-2 text-left",
                selectedCategory === null
                  ? "strapi-brand text-white"
                  : "bg-white text-black",
              )}
            >
              Show All
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "w-full rounded-lg p-2 text-left",
                  selectedCategory === category.id
                    ? "strapi-brand text-white"
                    : "bg-white text-black",
                )}
              >
                <span className="flex flex-col">
                  <span className="font-semibold">{category.title}</span>
                  <span>{category.description}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* CourseCards */}
      <div className="order-2 md:order-1 md:col-span-4">
        <CourseCards courses={filteredCourses} showProgress={true} />
      </div>
    </div>
  );
};

export default CoursesPage;
