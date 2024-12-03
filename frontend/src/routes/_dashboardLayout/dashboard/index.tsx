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
  // Fetch processed courses with progress
  const {
    data: processedCourses = [],
    isLoading: isCoursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["processedCourses"],
    queryFn: fetchProcessedCourses,
  });

  // Fetch new courses
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
          <p>No courses in progress</p>
        )}
      </div>

      {/* New Courses */}
      <div className="space-y-8">
        <h2 className="mb-6 text-2xl font-bold">New Courses</h2>
        {newCourses.length > 0 ? (
          <GalleryCards galleryItems={newCourses} />
        ) : (
          <p>No new courses available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
