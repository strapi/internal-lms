import { CourseCards } from '@/components/CourseCards';
import { generateCourses } from '@mock/dashboard';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/courses/')({
  component: () => <CoursesPage />,
})

function CoursesPage() {
  const courses = generateCourses(20);
  return (
    <div>
      <CourseCards courses={ courses } showProgress={ false } />;
    </div>
  )
}
