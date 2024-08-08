import { CourseCards } from '@/components/CourseCards';
import { GalleryCards } from '@/components/GalleryCards';
import { generateCourses } from '@mock/courses';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboardLayout/dashboard/')({
  component: () => <Dashboard />,
});

function Dashboard() {
  const courses = generateCourses(20);
  return (
    <div className="space-y-16 max-w-screen-2xl mx-auto p-4 md:p-8">
      <div className="space-y-8">
        <h2 className="text-center font-bold text-4xl mb-6">Courses in Progress</h2>
        <CourseCards courses={ courses.slice(0, 3) } showProgress />
      </div>
      <div className="space-y-8">
        <h2 className="text-center font-bold text-4xl mb-6">New Courses</h2>
        <GalleryCards galleryItems={ courses } />
      </div>
    </div>
  );
}
