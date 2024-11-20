import { Card } from "@/components/ui/card";
import { Course } from "@/interfaces/course";
import { Link } from "@tanstack/react-router";

const IMAGE_URL = import.meta.env.VITE_STRAPI_IMAGE_URL;

interface CourseCardsProps {
  courses: Course[];
  showProgress?: boolean;
}

export const CourseCards: React.FC<CourseCardsProps> = ({
  courses,
  // showProgress,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {courses.map((course: Course) => (
        <Link key={course.id} to={`/course/${course.documentId}`}>
          <Card key={course.id} className="rounded-lg p-6 shadow-lg">
            {course.thumbnail && (
              <img
                src={`${IMAGE_URL}/${course.thumbnail.url}`}
                alt="Card Image"
                width={600}
                height={400}
                className="h-48 w-full rounded-t-lg object-cover"
              />
            )}
            <div className="mt-4">
              <h3 className="text-xl font-bold">{course.title}</h3>
              {/* <div className="mt-4">
                <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                  {showProgress && (
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: `${course.progress}%` }}
                    />
                  )}
                </div>
              </div> */}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};
