import React from "react";
import { Card } from "@/components/ui/card";
import { CourseCardsProps } from "@/interfaces/course";
import { createOrUpdateCourseStatus } from "@/lib/queries/appQueries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Check, Play, Star, StarOff } from "lucide-react";

const IMAGE_URL = import.meta.env.VITE_STRAPI_IMAGE_URL;

export const CourseCards: React.FC<CourseCardsProps> = React.memo(
  ({ courses, showProgress }) => {
    const queryClient = useQueryClient();

    const toggleFavouriteMutation = useMutation({
      mutationFn: async ({
        courseDocumentId,
        isFavourite,
      }: {
        courseDocumentId: string;
        isFavourite: boolean;
      }) =>
        createOrUpdateCourseStatus({
          course: courseDocumentId,
          isFavourite,
          progress: 0,
          sections: [],
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["processedCourses"] });
      },
    });

    const handleFavouriteClick = (
      courseDocumentId: string,
      isCurrentlyFavourite: boolean,
    ) => {
      toggleFavouriteMutation.mutate({
        courseDocumentId,
        isFavourite: !isCurrentlyFavourite,
      });
    };

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
              <Link to={`/courses/${course.slug}`} className="block">
                {course.thumbnail && (
                  <img
                    src={`${IMAGE_URL}/${course.thumbnail.url}`}
                    alt={`${course.title} Thumbnail`}
                    width={600}
                    height={400}
                    className="h-48 w-full rounded-t-lg object-cover"
                  />
                )}
                <div className="px-6 pt-6">
                  <h3 className="text-xl font-bold">{course.title}</h3>

                  {showProgress && (
                    <div className="mt-4">
                      <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2.5 rounded-full strapi-brand"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      {course.synopsis && (
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                          {course.synopsis}
                        </p>
                      )}
                      <div className="flex justify-center py-4">
                        {buttonLabel && (
                          <>
                            {progress < 100 ? (
                              <button className="mt-2 flex items-center rounded-3xl border border-slate-700 strapi-brand px-4 py-1 text-sm text-white hover:bg-blue-600">
                                <span className="mr-2">{buttonLabel}</span>
                                <Play size={16} />
                              </button>
                            ) : (
                              <span className="mt-2 inline-flex items-center rounded-3xl border border-slate-700 bg-green-500 px-4 py-1 text-sm text-white">
                                <span className="mr-2">{buttonLabel}</span>
                                <Check size={16} />
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="flex items-center justify-between px-6 pb-6">
                <button
                  onClick={() =>
                    handleFavouriteClick(
                      course.documentId,
                      !!course.isFavourite,
                    )
                  }
                  className="focus:outline-none"
                  aria-label={
                    course.isFavourite
                      ? "Remove from favourites"
                      : "Add to favourites"
                  }
                >
                  {toggleFavouriteMutation.isLoading &&
                  toggleFavouriteMutation.variables?.courseDocumentId ===
                    course.documentId ? (
                    <div className="spinner">Loading...</div>
                  ) : course.isFavourite ? (
                    <Star color="yellow" size={24} />
                  ) : (
                    <StarOff color="gray" size={24} />
                  )}
                </button>
                <p className="mt-2 text-xs font-semibold text-gray-600 dark:text-gray-400">
                  {totalSections} {totalSections === 1 ? "Section" : "Sections"}{" "}
                  | {totalModules} {totalModules === 1 ? "Module" : "Modules"}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    );
  },
);
