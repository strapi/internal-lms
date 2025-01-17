import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "react-toastify";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Checkbox } from "@/components/ui/checkbox";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MuxPlayer from "@mux/mux-player-react";
import {
  fetchCourseBySlug,
  createOrUpdateCourseStatus,
  fetchUserData,
  fetchCoursesByCategory,
} from "@/lib/queries/appQueries";
import { Course, Module, Section } from "@/interfaces/course";
import { User } from "@/interfaces/auth";
import { ArrowLeft, Star, StarOff } from "lucide-react";
import { CourseCards } from "@/components/CourseCards";
import { getStrapiMedia, STRAPI_URL } from "@/lib/utils";

const SingleCourse: React.FC = () => {
  const { courseSlug } = useParams({
    from: "/_dashboardLayout/courses/$courseSlug",
  });

  const queryClient = useQueryClient();

  const {
    data: course,
    isLoading,
    error,
  } = useQuery<Course, Error>({
    queryKey: ["course", courseSlug],
    queryFn: () => fetchCourseBySlug(courseSlug!),
    enabled: !!courseSlug,
  });

  const { data: relatedCourses = [] } = useQuery({
    queryKey: ["relatedCourses", course?.categories.map((cat) => cat.id)],
    queryFn: () =>
      course
        ? fetchCoursesByCategory(
            course.categories.map((cat) => Number(cat.id)), // Convert to numbers
            course.documentId,
          )
        : [],
    enabled: !!course,
  });

  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User, Error>({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });

  const [activeSectionDocumentId, setActiveSectionDocumentId] = useState<
    string | null
  >(null);
  const [activeModuleDocumentId, setActiveModuleDocumentId] = useState<
    string | null
  >(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>(
    {},
  );

  const { mutate: updateCourseStatus } = useMutation({
    mutationFn: createOrUpdateCourseStatus,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["userData"] }),
  });

  const toggleFavourite = () => {
    if (course) {
      const isFavourite = userData?.courseStatuses?.find(
        (status) => status.course.documentId === course.documentId,
      )?.isFavourite;

      toast(
        !isFavourite
          ? `${course.title} added to favourites`
          : `${course.title} removed from favourites`,
      );

      updateCourseStatus({
        course: course.documentId,
        isFavourite: !isFavourite,
        progress: 0,
        sections: [],
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (course && userData) {
      const courseStatus = userData.courseStatuses.find(
        (status) => status.course?.documentId === course.documentId,
      );

      let progressMap: Record<string, number> = {};

      if (courseStatus) {
        progressMap = courseStatus.sections.reduce(
          (acc, sectionStatus) => ({
            ...acc,
            ...Object.fromEntries(
              sectionStatus.modules.map((moduleStatus) => [
                moduleStatus.module.documentId,
                moduleStatus.progress,
              ]),
            ),
          }),
          {},
        );
      }

      setModuleProgress(progressMap);

      if (!activeModuleDocumentId && !activeSectionDocumentId) {
        let firstIncompleteModule: Module | undefined;

        if (courseStatus) {
          firstIncompleteModule = course.sections
            .flatMap((section) => section.modules)
            .find((module) => (progressMap[module.documentId] || 0) < 100);
        }

        // If no progress or all modules are complete, select the first module
        if (!firstIncompleteModule) {
          firstIncompleteModule = course.sections[0]?.modules[0];
        }

        if (firstIncompleteModule) {
          setActiveModuleDocumentId(firstIncompleteModule.documentId);
          setActiveSectionDocumentId(
            course.sections.find((section) =>
              section.modules.some(
                (module) =>
                  module.documentId === firstIncompleteModule?.documentId,
              ),
            )?.documentId || null,
          );
        }
      }
    }
  }, [course, userData, activeModuleDocumentId, activeSectionDocumentId]);

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (player && activeModuleDocumentId && course) {
      const currentTime = player.currentTime;
      const duration = player.duration;

      if (duration > 0) {
        const progress = Math.min(
          Math.floor((currentTime / duration) * 99),
          99,
        );

        setModuleProgress((prev) => ({
          ...prev,
          [activeModuleDocumentId]: Math.max(
            progress,
            prev[activeModuleDocumentId] || 0,
          ),
        }));
      }
    }
  };

  const handleVideoEnd = () => {
    if (activeModuleDocumentId && course) {
      // Mark the current module as complete
      setModuleProgress((prev) => {
        const updatedProgress = { ...prev, [activeModuleDocumentId]: 100 };

        const sections = course.sections;
        let foundNextModule = false;

        for (let i = 0; i < sections.length; i++) {
          const section = sections[i];

          const currentModuleIndex = section.modules.findIndex(
            (module) => module.documentId === activeModuleDocumentId,
          );

          if (currentModuleIndex !== -1) {
            // Check for next module in the same section
            if (currentModuleIndex + 1 < section.modules.length) {
              const nextModule = section.modules[currentModuleIndex + 1];

              setActiveModuleDocumentId(nextModule.documentId);
              setActiveSectionDocumentId(section.documentId);
              foundNextModule = true;
              break;
            }

            // Check for next section
            if (i + 1 < sections.length) {
              const nextSection = sections[i + 1];

              if (nextSection.modules.length > 0) {
                setActiveSectionDocumentId(nextSection.documentId);
                setActiveModuleDocumentId(nextSection.modules[0].documentId);
                foundNextModule = true;
                break;
              }
            }
          }
        }

        if (!foundNextModule) {
          toast("Congratulations! You have completed this course.");
        }

        // Calculate progress after marking the module complete
        const totalModules = sections.reduce(
          (count, section) => count + section.modules.length,
          0,
        );
        const totalProgress = Object.values(updatedProgress).reduce(
          (sum, progress) => sum + progress,
          0,
        );
        const overallProgress = (totalProgress / totalModules) * 100;

        updateCourseStatus({
          course: course.documentId,
          progress: Math.round(overallProgress),
          sections: sections.map((section) => ({
            sectionDocumentId: section.documentId,
            modules: section.modules.map((module) => ({
              moduleDocumentId: module.documentId,
              progress: updatedProgress[module.documentId] || 0,
            })),
          })),
        });

        return updatedProgress;
      });
    }
  };

  if (isLoading || userLoading) return <div>Loading course...</div>;
  if (error || userError)
    return (
      <div>Error loading course: {error?.message || userError?.message}</div>
    );
  if (!course) return <div>No course data available.</div>;

  const activeModule = course.sections
    ?.flatMap((section) => section.modules)
    .find((module) => module.documentId === activeModuleDocumentId);

  const poster = getStrapiMedia(STRAPI_URL, course.thumbnail?.url || "");

  const isFavourite = userData?.courseStatuses?.find(
    (status) => status.course.documentId === course.documentId,
  )?.isFavourite;

  return (
    <div className="flex w-full gap-4">
      <div className="flex w-[70%] flex-col">
        <div className="aspect-video rounded-lg">
          {activeModule ? (
            activeModule.media?.playback_id ? (
              <MuxPlayer
                ref={playerRef}
                playbackId={activeModule.media.playback_id}
                metadata={{
                  video_id: `mux-video-${activeModule.media.playback_id}`,
                  video_title: activeModule.title,
                }}
                poster={poster || undefined}
                className="h-full w-full"
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleVideoEnd}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black text-white">
                <p>No video available</p>
              </div>
            )
          ) : (
            // Placeholder content when all modules are complete
            <div className="flex h-full flex-col items-center justify-center gap-6 rounded-lg border bg-white p-24 shadow-md dark:bg-gray-800">
              <div className="h-24 w-24">
                <img src="/strapi.svg" alt="All modules completed" />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Congratulations! You've completed all the modules in this
                course.
              </h3>
            </div>
          )}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{course.title}</h1>
            <button
              onClick={toggleFavourite}
              className="focus:outline-none"
              aria-label={
                isFavourite ? "Remove from favourites" : "Add to favourites"
              }
            >
              {isFavourite ? (
                <Star className="text-yellow-500" size={24} />
              ) : (
                <StarOff
                  className="text-gray-500 dark:text-gray-400"
                  size={24}
                />
              )}
            </button>
          </div>

          <h3 className="mb-4 text-lg font-semibold text-white">
            {activeModule?.title || "Select a module to view"}
          </h3>

          <div className="rich-text">
            <BlocksRenderer content={course.description} />
          </div>

          {/* Related Courses Section */}
          {relatedCourses.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold">Related Courses</h2>
              <CourseCards courses={relatedCourses} showProgress={false} />
            </div>
          )}
        </div>
      </div>

      <div className="flex w-[30%] flex-col self-start overflow-hidden rounded-lg border bg-white p-6 dark:bg-gray-800">
        <Link
          to="/courses"
          className="mb-6 flex items-center justify-center gap-2 rounded-3xl border border-slate-400 p-2 px-4 text-left text-black hover:bg-white dark:text-white dark:hover:text-black"
        >
          <ArrowLeft />
          <span className="text-md font-semibold">Back to courses</span>
        </Link>
        <ul className="mb-6 flex flex-wrap gap-2">
          {course.categories.map((category) => (
            <li key={category.id}>
              <p className="strapi-brand rounded-3xl p-2 px-4 text-left text-white">
                <span className="text-sm font-semibold">{category.name}</span>
              </p>
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Modules
        </h2>
        <Accordion
          type="single"
          collapsible
          className="flex-1"
          value={activeSectionDocumentId || undefined}
          onValueChange={(value) => {
            setActiveSectionDocumentId(value || null);
          }}
        >
          {course.sections?.map((section: Section, index: number) => {
            const totalModules = section.modules.length;
            const completedModules = section.modules.filter(
              (module) => moduleProgress[module.documentId] === 100,
            ).length;

            return (
              <AccordionItem
                key={section.documentId}
                value={section.documentId}
              >
                <AccordionTrigger className="flex flex-col items-start">
                  <div className="flex w-full items-center justify-between gap-4 text-start">
                    <h3 className="text-md font-bold text-black dark:text-white">
                      {index + 1}. {section.name}
                    </h3>
                    <p className="ml-auto font-semibold text-black dark:text-white">{`${completedModules}/${totalModules}`}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <p className="mb-6 text-start text-black dark:text-white">
                      {section.description}
                    </p>

                    {section.modules.map((module: Module) => (
                      <div
                        key={module.documentId}
                        className="cursor-pointer"
                        onClick={() => {
                          setActiveModuleDocumentId(module.documentId);
                          setActiveSectionDocumentId(section.documentId);
                        }}
                      >
                        <div
                          className={`flex flex-col rounded-lg p-4 ${
                            activeModuleDocumentId === module.documentId
                              ? "strapi-brand text-white"
                              : "strapi-brand-hover text-inherit"
                          }`}
                        >
                          <div className="mb-4 flex justify-between">
                            <h4 className="text-base font-semibold dark:text-white">
                              {module.title}
                            </h4>
                            <Checkbox
                              className="mt-1"
                              checked={
                                moduleProgress[module.documentId] === 100
                              }
                            />
                          </div>
                          {module.description && <p>{module.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {course.sections.every((section) =>
          section.modules.every(
            (module) => moduleProgress[module.documentId] === 100,
          ),
        ) && (
          <div className="mt-12 rounded-lg border border-slate-400 bg-white p-6 dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Congratulations! 🎉
            </h2>
            <p className="text-md mt-2 text-gray-700 dark:text-gray-300">
              You've successfully completed the course. Feel free to explore
              related courses or revisit the modules anytime!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_dashboardLayout/courses/$courseSlug")({
  component: SingleCourse,
});
