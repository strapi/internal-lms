// courseSlug.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import { Checkbox } from "@/components/ui/checkbox";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import MuxPlayer from "@mux/mux-player-react";
import {
  fetchCourseBySlug,
  createOrUpdateCourseStatus,
  fetchUserCourseStatuses,
} from "@/lib/queries/appQueries";
import { Course, UserCourseStatus } from "@/interfaces/course";
import { User as AuthUser } from "@/interfaces/auth";

interface User extends AuthUser {
  courseStatuses?: UserCourseStatus[];
}

const IMAGE_URL = import.meta.env.VITE_STRAPI_IMAGE_URL;

const SingleCourse: React.FC = () => {
  const { courseSlug } = useParams({
    from: "/_dashboardLayout/courses/course/$courseSlug",
  });

  const {
    data: course,
    isLoading,
    error,
  } = useQuery<Course, Error>({
    queryKey: ["course", courseSlug],
    queryFn: () => fetchCourseBySlug(courseSlug!),
    enabled: !!courseSlug,
  });

  const {
    data: authenticatedUser,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User, Error>({
    queryKey: ["authenticatedUser"],
    queryFn: fetchUserCourseStatuses,
  });

  const [activeModuleDocumentId, setActiveModuleDocumentId] = useState<
    string | null
  >(null);
  const [activeSectionDocumentId, setActiveSectionDocumentId] = useState<
    string | null
  >(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>(
    {},
  );

  const { mutate: updateCourseStatus } = useMutation({
    mutationFn: createOrUpdateCourseStatus,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Prepopulate module progress and set active module/section
  useEffect(() => {
    if (course && authenticatedUser && authenticatedUser.courseStatuses) {
      const courseStatus = authenticatedUser.courseStatuses.find(
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
      } else if (course.section.length > 0) {
        const firstSection = course.section[0];
        setActiveSectionDocumentId(firstSection.documentId);
        if (firstSection.modules.length > 0) {
          setActiveModuleDocumentId(firstSection.modules[0].documentId);
        }
      }
    }
  }, [course, authenticatedUser]);

  // Track playback progress
  const handleTimeUpdate = () => {
    const player = playerRef.current;
    if (player && activeModuleDocumentId && course) {
      const currentTime = player.currentTime;
      const duration = player.duration;

      if (duration > 0) {
        const progress = Math.min(
          Math.floor((currentTime / duration) * 100),
          100,
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

  // Update module and course progress
  const handleVideoEnd = () => {
    if (activeModuleDocumentId && course) {
      const section = course.section.find((section) =>
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

      const moduleProgressValue = moduleProgress[activeModuleDocumentId] || 0;

      const totalModules = course.section.reduce(
        (total, section) => total + section.modules.length,
        0,
      );

      const overallProgress =
        Object.values(moduleProgress).reduce((a, b) => a + b, 0) /
          totalModules || 0;

      updateCourseStatus({
        course: course.documentId,
        progress: Math.round(overallProgress),
        sections: [
          {
            sectionDocumentId: sectionDocumentId,
            modules: [
              {
                moduleDocumentId: module.documentId,
                progress: moduleProgressValue,
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

  const activeModule = course.section
    ?.flatMap((section) => section.modules)
    .find((module) => module.documentId === activeModuleDocumentId);

  const poster = IMAGE_URL + (course.thumbnail?.url || "");

  return (
    <div className="flex h-[calc(100vh-56px)] w-full">
      {/* Video Section */}
      <div className="flex w-[80%] flex-col">
        <div className="h-[70%] flex-1 overflow-hidden rounded-r-lg px-8">
          <div className="relative h-full w-full">
            <div className="absolute inset-0 overflow-hidden">
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
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white backdrop-blur-sm">
              <h3 className="text-lg font-bold">{course.title}</h3>
              <p className="text-sm">
                {activeModule?.title || "Select a module to view"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 px-8">
          <BlocksRenderer content={course.description} />
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="flex w-[20%] flex-col overflow-hidden rounded-l-lg bg-white p-6 dark:bg-gray-950">
        <h2 className="text-lg font-semibold">{course.title}</h2>
        <Accordion type="single" collapsible className="flex-1">
          {course.section?.map((section) => {
            const totalModules = section.modules.length;
            const completedModules = section.modules.filter(
              (module) => moduleProgress[module.documentId] === 100,
            ).length;

            return (
              <AccordionItem
                key={section.documentId}
                value={`section-${section.documentId}`}
                open={section.documentId === activeSectionDocumentId}
              >
                <AccordionTrigger className="flex items-center justify-between">
                  <h3 className="text-md font-semibold">{section.name}</h3>
                  <span>{`${completedModules}/${totalModules}`}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {section.modules.map((module) => (
                      <div
                        key={module.documentId}
                        className={`flex cursor-pointer items-center gap-2 p-2 ${
                          activeModuleDocumentId === module.documentId
                            ? "border-4 border-double"
                            : ""
                        }`}
                        onClick={() => {
                          setActiveModuleDocumentId(module.documentId);
                          setActiveSectionDocumentId(section.documentId);
                        }}
                      >
                        <Checkbox
                          checked={moduleProgress[module.documentId] === 100}
                        />
                        <span>{module.title}</span>
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

export const Route = createFileRoute(
  "/_dashboardLayout/courses/course/$courseSlug",
)({
  component: SingleCourse,
});
