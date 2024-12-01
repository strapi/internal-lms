import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CourseCards } from "@/components/CourseCards";
import { Category, Course } from "@/interfaces/course";
import { fetchCategories, fetchCourses } from "@/lib/queries/appQueries";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_dashboardLayout/courses/")({
  component: () => <CoursesPage />,
});

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: courses = [],
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  // Handle loading states
  if (isCategoriesLoading || isCoursesLoading) {
    return <div>Loading...</div>;
  }

  // Handle error states
  if (categoriesError) {
    return <div>Error loading categories: {categoriesError.message}</div>;
  }

  if (coursesError) {
    return <div>Error loading courses: {coursesError.message}</div>;
  }

  // Filter courses based on selected category
  const filteredCourses = selectedCategory
    ? courses.filter((course: Course) =>
        course.categories.some(
          (category: Category) => category.id === selectedCategory,
        ),
      )
    : courses;

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-5">
      {/* Categories List */}
      <div className="order-1 space-y-4 rounded-lg border bg-white p-6 shadow-md dark:bg-gray-950 md:order-2 md:col-span-1">
        <h2 className="mb-4 text-xl font-bold">Categories</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "w-full rounded-lg p-2 text-left",
                selectedCategory === null
                  ? "bg-blue-500 text-white"
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
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black",
                )}
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
