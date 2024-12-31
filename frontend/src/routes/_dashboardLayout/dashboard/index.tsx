import { useQuery } from "@tanstack/react-query";
import { CourseCards } from "@/components/CourseCards";
import { GalleryCards } from "@/components/GalleryCards";
import {
  fetchNewCourses,
  fetchProcessedCourses,
} from "@/lib/queries/appQueries";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_dashboardLayout/dashboard/")({
  component: () => <Dashboard />,
});

function Dashboard() {
  const categoryName = null; // Change this dynamically if needed

  // Fetch processed courses with progress
  const {
    data: processedCourses = [],
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["processedCourses", categoryName], // Include categoryName
    queryFn: ({ queryKey }) => {
      const [, categoryName] = queryKey; // Extract categoryName
      return fetchProcessedCourses(categoryName);
    },
  });

  // Fetch new courses (unchanged)
  const {
    data: newCourses = [],
    isLoading: isNewCoursesLoading,
    error: newCoursesError,
  } = useQuery({
    queryKey: ["newCourses"],
    queryFn: fetchNewCourses,
  });

  if (isCoursesLoading || isNewCoursesLoading) {
    return <div>Loading...</div>;
  }

  if (coursesError) {
    return <div>Error loading courses: {coursesError.message}</div>;
  }

  if (newCoursesError) {
    return <div>Error loading new courses: {newCoursesError.message}</div>;
  }

  const userCourses = processedCourses.filter((course) => course.progress > 0);

  return (
    <div className="mx-auto max-w-screen-2xl space-y-16">
      {/* Courses in Progress */}
      <div className="space-y-8">
        <h2 className="mb-6 text-2xl font-bold">Courses in Progress</h2>
        {userCourses.length > 0 ? (
          <CourseCards courses={userCourses.slice(0, 3)} showProgress={true} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 rounded-lg border bg-white p-24 shadow-md dark:bg-gray-800">
            <div className="h-24 w-24">
              <img src="/strapi.svg" />
            </div>
            <h3 className="text-lg font-semibold">No courses in progress</h3>
          </div>
        )}
      </div>

      {/* New Courses */}
      <div className="space-y-8">
        <h2 className="mb-6 text-2xl font-bold">New Courses</h2>
        {newCourses.length > 0 ? (
          <GalleryCards galleryItems={newCourses} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 rounded-lg border bg-white p-24 shadow-md dark:bg-gray-800">
            <div className="h-24 w-24">
              <img src="/strapi.svg" />
            </div>
            <h3 className="text-lg font-semibold">No new courses available</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
