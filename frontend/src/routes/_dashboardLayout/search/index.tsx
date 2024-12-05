import React from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GalleryCards } from "@/components/GalleryCards";
import { searchQuery } from "@/lib/queries/appQueries";

export const Route = createFileRoute("/_dashboardLayout/search/")({
  component: () => <SearchResultsPage />,
});

export const SearchResultsPage: React.FC = () => {
  const { q }: { q: string } = useSearch({ strict: false });
  const query = q || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["searchResults", query],
    queryFn: () => searchQuery(q),
    enabled: !!query,
  });

  if (isLoading) return <div>Loading search results...</div>;
  if (error) return <div>Error fetching search results: {error.message}</div>;

  const { courses = [] } = data || {};

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Search Results for "{query}"</h2>

      {courses.length > 0 ? (
        <GalleryCards galleryItems={courses} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border bg-white p-24 shadow-md dark:bg-gray-800">
          <div className="h-24 w-24">
            <img src="/strapi.svg" />
          </div>
          <h3 className="text-lg font-semibold">
            No results found for "{query}".
          </h3>
        </div>
      )}
    </div>
  );
};
