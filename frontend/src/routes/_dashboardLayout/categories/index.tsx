import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/queries/appQueries";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_dashboardLayout/categories/")({
  component: () => <CategoriesPage />,
});

export const CategoriesPage: React.FC = () => {
  const {
    data: categories,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error loading categories: {error.message}</div>;

  if (!categories || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-lg border bg-white p-24 shadow-md dark:bg-gray-800">
        <div className="h-24 w-24">
          <img src="/icons/no-data.svg" alt="No Categories" />
        </div>
        <h3 className="text-lg font-semibold">
          No categories available at the moment.
        </h3>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Categories</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.documentId}
            className="flex flex-col items-start rounded-lg border p-4 shadow-sm hover:shadow-md dark:bg-gray-800"
          >
            <h3 className="mb-4 text-lg font-semibold">{category.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {category.description}
            </p>
            <div className="mt-4">
              <Link
                to={`/courses`}
                search={{ category: category.name }}
                className="strapi-brand flex items-center rounded-lg px-4 py-2 text-sm text-white hover:bg-blue-600"
              >
                <span className="mr-2">View {category.name} Courses</span>
                <ArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
