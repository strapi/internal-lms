import React from "react";
import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { GalleryCards } from "@/components/GalleryCards";
import { searchQuery } from "@/lib/queries/appQueries";

export const Route = createFileRoute("/_dashboardLayout/search/")({
  component: () => <SearchResultsPage />,
});

export const SearchResultsPage: React.FC = () => {
  const { q } = useSearch({ strict: false });
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
        <p>No results found for "{query}".</p>
      )}
    </div>
  );
};
