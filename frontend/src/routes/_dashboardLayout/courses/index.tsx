import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CourseCards } from "@/components/CourseCards";
import {
  createFileRoute,
  useSearch,
  useNavigate,
} from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  fetchCategories,
  fetchProcessedCourses,
} from "@/lib/queries/appQueries";

export const Route = createFileRoute("/_dashboardLayout/courses/")({
  meta: () => {
    return [
      {
        title: `Courses`,
      },
      {
        name: "description",
        content: `Explore courses. Learn and grow with us!`,
      },
    ];
  },
  component: () => <CoursesPage />,
});

const CoursesPage: React.FC = () => {
  const { category }: { category: string } = useSearch({ strict: false });
  const navigate = useNavigate();

  const selectedCategory = category || null;
  const [showFavorites, setShowFavorites] = React.useState(false);

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
    queryKey: ["processedCourses", selectedCategory],
    queryFn: () => fetchProcessedCourses(selectedCategory),
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
        (category) => category.name === selectedCategory,
      );
    }
    return true;
  });

  const handleCategoryClick = (categoryName: string | null) => {
    navigate({
      to: "/courses",
      search: { category: categoryName || undefined },
    });
  };

  return (
    <div className="flex gap-4">
      {/* Filters */}
      <div className="order-1 w-[30%] rounded-lg border bg-white p-6 shadow-md dark:bg-gray-800 md:order-2 md:col-span-1">
        <h2 className="mb-4 text-xl font-semibold">Filter by categories</h2>
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => handleCategoryClick(category.name)}
                className={cn(
                  "rounded-3xl p-2 px-4 text-left",
                  selectedCategory === category.name
                    ? "strapi-brand text-white"
                    : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white",
                )}
              >
                <span className="font-semibold">{category.name}</span>
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handleCategoryClick(null)}
              className={cn(
                "rounded-3xl p-2 px-4 text-left",
                selectedCategory === null
                  ? "strapi-brand text-white"
                  : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white",
              )}
            >
              <span className="font-semibold">Show All</span>
            </button>
          </li>
        </ul>
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Filter by favourites</h2>
          <button
            onClick={() => setShowFavorites((prev) => !prev)}
            className={cn(
              "w-full rounded-3xl p-2 px-4 text-left",
              showFavorites
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white",
            )}
          >
            {showFavorites ? "Show All Courses" : "Show Favorites"}
          </button>
        </div>
      </div>

      {/* CourseCards */}
      <div className="order-2 w-[70%] md:order-1 md:col-span-4">
        {filteredCourses.length ? (
          <CourseCards courses={filteredCourses} showProgress={true} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 rounded-lg border bg-white p-24 shadow-md dark:bg-gray-800">
            <div className="h-24 w-24">
              <img src="/strapi.svg" />
            </div>
            <h3 className="text-lg font-semibold">
              Nothing found, try adjusting your filters
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
