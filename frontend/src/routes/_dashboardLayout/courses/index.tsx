import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CourseCards } from "@/components/CourseCards";
import { Course, Category } from "@/interfaces/course";
import {
  fetchCategories,
  fetchCourses,
  fetchUserData,
} from "@/lib/queries/appQueries";
import { cn } from "@/lib/utils";
import { UserCourseStatus } from "@/interfaces/course";
import { User } from "@/interfaces/auth";

export const Route = createFileRoute("/_dashboardLayout/courses/")({
  component: () => <CoursesPage />,
});

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    data: courses = [],
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const {
    data: user = null,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<User>({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  if (isCategoriesLoading || isCoursesLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (categoriesError)
    return <div>Error loading categories: {categoriesError.message}</div>;
  if (coursesError)
    return <div>Error loading courses: {coursesError.message}</div>;
  if (userError) return <div>Error loading user data: {userError.message}</div>;

  // Combine course data with user course statuses
  const courseStatuses: UserCourseStatus[] = user?.courseStatuses || [];
  const courseStatusMap = new Map<string, UserCourseStatus>();

  courseStatuses.forEach((courseStatus) => {
    courseStatusMap.set(courseStatus.course.documentId, courseStatus);
  });

  interface CourseWithProgress extends Course {
    progress: number;
    isFavourite: boolean;
  }

  const processedCourses: CourseWithProgress[] = courses.map((course) => {
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

  // Filter courses by favorites
  const favoriteCourses = processedCourses.filter(
    (course) => course.isFavourite,
  );

  // Filter courses by category
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
