// CourseCards.tsx
import { Card } from "@/components/ui/card";
import { Course } from "@/interfaces/course";
import { Link } from "@tanstack/react-router";
import { Check, Play, Star } from "lucide-react";

const IMAGE_URL = import.meta.env.VITE_STRAPI_IMAGE_URL;

interface CourseWithProgress extends Course {
  progress: number;
}

interface CourseCardsProps {
  courses: CourseWithProgress[];
  showProgress?: boolean;
}

export const CourseCards: React.FC<CourseCardsProps> = ({
  courses,
  showProgress,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {courses.map((course) => {
        const totalSections = course.sections?.length || 0;
        const totalModules =
          course.sections?.reduce(
            (count, section) => count + (section.modules?.length || 0),
            0,
          ) || 0;

        const progress = course.progress || 0;

        let buttonLabel = "";
        if (progress === 0) {
          buttonLabel = "Start";
        } else if (progress > 0 && progress < 100) {
          buttonLabel = "Resume";
        } else if (progress === 100) {
          buttonLabel = "Completed";
        }

        return (
          <Card key={course.id} className="rounded-lg shadow-lg">
            <Link to={`/courses/${course.slug}`}>
              {course.thumbnail && (
                <img
                  src={`${IMAGE_URL}/${course.thumbnail.url}`}
                  alt="Card Image"
                  width={600}
                  height={400}
                  className="h-48 w-full rounded-t-lg object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold">{course.title}</h3>

                {showProgress && (
                  <div className="mt-4">
                    <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2.5 rounded-full bg-blue-600"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {course.synopsis && (
                      <p className="mt-4">{course.synopsis}</p>
                    )}
                    <div className="flex justify-center py-4">
                      {buttonLabel && (
                        <>
                          {progress < 100 ? (
                            <button className="text-s mt-2 flex items-center rounded-3xl border border-slate-700 px-4 py-1 text-white">
                              <span className="mr-2">{buttonLabel}</span>
                              <Play size={16} />
                            </button>
                          ) : (
                            <span className="text-s mt-2 inline-block flex items-center rounded-3xl border border-slate-700 px-4 py-1 text-white">
                              <span className="mr-2">{buttonLabel}</span>
                              <Check size={16} />
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex content-center justify-between">
                  <button>
                    <Star />
                  </button>

                  <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                    {totalSections}{" "}
                    {totalSections === 1 ? "Section" : "Sections"} |{" "}
                    {totalModules} {totalModules === 1 ? "Module" : "Modules"}
                  </p>
                </div>
              </div>
            </Link>
          </Card>
        );
      })}
    </div>
  );
};
