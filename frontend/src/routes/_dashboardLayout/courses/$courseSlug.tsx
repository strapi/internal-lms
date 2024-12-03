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

const IMAGE_URL = import.meta.env.VITE_STRAPI_IMAGE_URL;

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
            course.categories.map((cat) => cat.id),
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
    if (course && userData && userData.courseStatuses) {
      const courseStatus = userData.courseStatuses.find(
        (status) => status.course?.documentId === course.documentId,
      );

      const progressMap: Record<string, number> = {};
      let nextModuleDocumentId: string | null = null;
      let nextSectionDocumentId: string | null = null;

      if (courseStatus) {
        courseStatus.sections.forEach((sectionStatus) => {
          sectionStatus.modules.forEach((moduleStatus) => {
            const moduleDocId = moduleStatus.module.documentId;
            progressMap[moduleDocId] = moduleStatus.progress;

            if (nextModuleDocumentId === null && moduleStatus.progress < 100) {
              nextModuleDocumentId = moduleDocId;
              nextSectionDocumentId = sectionStatus.section.documentId;
            }
          });
        });
      }

      setModuleProgress(progressMap);

      if (nextModuleDocumentId) {
        setActiveModuleDocumentId(nextModuleDocumentId);
        setActiveSectionDocumentId(nextSectionDocumentId);
      } else if (course.sections.length > 0) {
        const firstSection = course.sections[0];
        setActiveSectionDocumentId(firstSection.documentId);
        if (firstSection.modules.length > 0) {
          setActiveModuleDocumentId(firstSection.modules[0].documentId);
        }
      }
    }
  }, [course, userData]);

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
      setModuleProgress((prev) => ({
        ...prev,
        [activeModuleDocumentId]: 100,
      }));

      const section = course.sections.find((section) =>
        section.modules.some(
          (module) => module.documentId === activeModuleDocumentId,
        ),
      );
      if (!section) return;

      const sectionDocumentId = section.documentId;
      const module = section.modules.find(
        (mod) => mod.documentId === activeModuleDocumentId,
      );

      if (!module) return;

      const totalModules = course.sections.reduce(
        (total, section) => total + section.modules.length,
        0,
      );

      const totalProgress = Object.values(moduleProgress).reduce(
        (a, b) => a + b,
        0,
      );
      const overallProgress = totalProgress / totalModules;

      updateCourseStatus({
        course: course.documentId,
        progress: Math.round(overallProgress),
        sections: [
          {
            sectionDocumentId: sectionDocumentId,
            modules: [
              {
                moduleDocumentId: module.documentId,
                progress: 100,
              },
            ],
          },
        ],
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

  const poster = IMAGE_URL + (course.thumbnail?.url || "");

  const isFavourite = userData?.courseStatuses?.find(
    (status) => status.course.documentId === course.documentId,
  )?.isFavourite;

  return (
    <div className="flex w-full gap-4">
      <div className="flex w-[70%] flex-col">
        <div className="aspect-video rounded-lg">
          {activeModule?.media?.playback_id ? (
            <MuxPlayer
              ref={playerRef}
              playbackId={activeModule.media.playback_id}
              metadata={{
                video_id: `mux-video-${activeModule.media.playback_id}`,
                video_title: activeModule.title,
              }}
              poster={poster}
              className="h-full w-full"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-black text-white">
              <p>No video available</p>
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

          <BlocksRenderer content={course.description} />

          {/* Related Courses Section */}
          {relatedCourses.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-4 text-xl font-bold">Related Courses</h2>
              <CourseCards courses={relatedCourses} showProgress={false} />
            </div>
          )}
        </div>
      </div>

      <div className="flex w-[30%] flex-col overflow-hidden rounded-lg border bg-white p-6 dark:bg-gray-800">
        <ul className="mb-6 flex flex-wrap gap-2">
          <li>
            <Link
              to="/courses"
              className="block flex items-center gap-2 rounded-3xl border border-slate-200 p-2 px-4 text-left text-white hover:bg-white hover:text-black"
            >
              <ArrowLeft />
              <span className="text-md font-semibold">Back</span>
            </Link>
          </li>
          {course.categories.map((category) => (
            <li key={category.id}>
              <p className="strapi-brand rounded-3xl p-2 px-4 text-left text-white">
                <span className="text-md font-semibold">{category.name}</span>
              </p>
            </li>
          ))}
        </ul>
        <h2 className="text-xl font-semibold text-white">Modules</h2>
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
                    <h3 className="text-md mb-2 font-bold text-white">
                      {index + 1}. {section.name}
                    </h3>
                    <p className="ml-auto font-semibold text-white">{`${completedModules}/${totalModules}`}</p>
                  </div>
                  <p className="pr-12 text-start text-white">
                    {section.description}
                  </p>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
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
                          <div className="mb-4 flex items-center justify-between">
                            <h4 className="text-base font-semibold">
                              {module.title}
                            </h4>
                            <Checkbox
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
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_dashboardLayout/courses/$courseSlug")({
  component: SingleCourse,
});
