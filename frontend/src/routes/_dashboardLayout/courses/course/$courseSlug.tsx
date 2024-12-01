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
import { Course, Module, Section, UserCourseStatus } from "@/interfaces/course";
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

  console.log("the course", course);

  const {
    data: authenticatedUser,
    isLoading: userLoading,
    error: userError,
  } = useQuery<User, Error>({
    queryKey: ["authenticatedUser"],
    queryFn: fetchUserCourseStatuses,
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
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Prepopulate module progress and set active module/section
  useEffect(() => {
    if (course && authenticatedUser && authenticatedUser.courseStatuses) {
      const courseStatus = authenticatedUser.courseStatuses.find(
        (status) => status.course?.documentId === course.documentId,
      );

      console.log("the courseStatus", courseStatus);

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

      console.log("Setting moduleProgress:", progressMap);
      setModuleProgress(progressMap);

      if (nextModuleDocumentId) {
        setActiveModuleDocumentId(nextModuleDocumentId);
        setActiveSectionDocumentId(nextSectionDocumentId);
      } else {
        // If no next module is found (user hasn't started or has completed all modules)
        // Set to the first module of the first section
        if (course.sections.length > 0) {
          const firstSection = course.sections[0];
          setActiveSectionDocumentId(firstSection.documentId);
          if (firstSection.modules.length > 0) {
            setActiveModuleDocumentId(firstSection.modules[0].documentId);
          }
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

  // Update module and course progress
  const handleVideoEnd = () => {
    if (activeModuleDocumentId && course) {
      // Set module progress to 100% when video ends
      setModuleProgress((prev) => ({
        ...prev,
        [activeModuleDocumentId]: 100,
      }));

      // Proceed to update course status
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

      // Update the course status with the new progres  s
      const totalModules = course.sections.reduce(
        (total, section) => total + section.modules.length,
        0,
      );

      const totalProgress = Object.values(moduleProgress).reduce(
        (a, b) => a + b,
        0,
      );
      const overallProgress = totalProgress / totalModules;

      console.log("module progress after video end", moduleProgress);

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

  return (
    <div className="flex w-full gap-4">
      {/* Video Section */}
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
          <h1 className="text-xl font-bold">{course.title}</h1>
          <p className="text-md mb-6">
            {activeModule?.title || "Select a module to view"}
          </p>
          <BlocksRenderer content={course.description} />
        </div>
      </div>

      {/* Sidebar Section */}
      <div className="flex w-[30%] flex-col overflow-hidden rounded-lg border bg-white p-6 dark:bg-gray-950">
        <h2 className="text-lg font-semibold">{course.title}</h2>
        <Accordion
          type="single"
          collapsible
          className="flex-1"
          value={activeSectionDocumentId || undefined}
          onValueChange={(value) => {
            setActiveSectionDocumentId(value || null);
          }}
        >
          {course.sections?.map((section: Section) => {
            const totalModules = section.modules.length;
            const completedModules = section.modules.filter(
              (module) => moduleProgress[module.documentId] === 100,
            ).length;

            return (
              <AccordionItem
                key={section.documentId}
                value={section.documentId}
              >
                <AccordionTrigger className="flex items-center justify-between">
                  <h3 className="text-md font-semibold">{section.name}</h3>
                  <span>{`${completedModules}/${totalModules}`}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {section.modules.map((module: Module) => (
                      <div
                        key={module.documentId}
                        className={`flex cursor-pointer items-center gap-2 p-2 ${
                          activeModuleDocumentId === module.documentId
                            ? "bg-blue-500 text-white"
                            : "bg-white text-black"
                        }`}
                        onClick={() => {
                          setActiveModuleDocumentId(module.documentId);
                          setActiveSectionDocumentId(section.documentId);
                        }}
                      >
                        <Checkbox
                          checked={moduleProgress[module.documentId] === 100}
                        />
                        <div className="flex-col flex">
                          <h4 className="text-sm font-semibold">
                            {module.title}
                          </h4>
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

export const Route = createFileRoute(
  "/_dashboardLayout/courses/course/$courseSlug",
)({
  component: SingleCourse,
});
