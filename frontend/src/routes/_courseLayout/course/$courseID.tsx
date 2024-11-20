import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Course, Module } from "@/interfaces/course";
import { createFileRoute } from "@tanstack/react-router";
import qs from "qs";
import MuxPlayer from "@mux/mux-player-react";

const API_URL = import.meta.env.VITE_STRAPI_API_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_KEY;
const MUX_SIGNING_KEY = import.meta.env.VITE_MUX_SIGNING_KEY_PRIVATE_KEY;

if (!API_URL || !API_TOKEN) {
  throw new Error("API_URL or API_TOKEN is missing. Check your .env file.");
}

function groupModulesBySection(modules: Module[]): Record<string, Module[]> {
  return modules.reduce(
    (acc, module) => {
      const section = module.section || "Uncategorized";
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(module);
      return acc;
    },
    {} as Record<string, Module[]>,
  );
}

export const Route = createFileRoute("/_courseLayout/course/$courseID")({
  loader: async ({ params }) => {
    const query = qs.stringify(
      {
        fields: ["title", "description"],
        populate: {
          thumbnail: { populate: "*" },
          categories: { populate: "*" },
          modules: { populate: "*" },
        },
      },
      { encodeValuesOnly: true },
    );

    const response = await fetch(
      `${API_URL}/courses/${params.courseID}?${query}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }

    const { data }: { data: Course } = await response.json();
    return { course: data, courseID: params.courseID };
  },
  component: SingleCourse,
});

export default function SingleCourse() {
  const { course } = Route.useLoaderData<{
    course: Course;
    courseID: string;
  }>();

  if (!course) {
    return <div>Loading...</div>;
  }

  // Group modules by section
  const modulesBySection = groupModulesBySection(course.modules);

  // Extract the first playable video playback_id
  const firstPlaybackId =
    course.modules.find((module) => module.media?.playback_id)?.media
      ?.playback_id || "";

  return (
    <div className="flex h-screen w-full">
      {/* Video Section */}
      <div className="h-[70%] flex-1 overflow-hidden rounded-r-lg bg-gray-100 dark:bg-gray-900">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 overflow-hidden">
            {firstPlaybackId ? (
              <MuxPlayer
                playbackId={firstPlaybackId}
                playback-token={MUX_SIGNING_KEY}
                metadata={{
                  video_id: `mux-video-${firstPlaybackId}`,
                  video_title: course.title,
                }}
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black text-white">
                <p>No video available</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 text-white backdrop-blur-sm">
            <h3 className="text-lg font-bold">{course.title}</h3>
            <p className="text-sm">
              {course.description.map((paragraph, index) => (
                <span key={index}>
                  {paragraph.children.map((child) => child.text).join(" ")}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
      {/* Sidebar Section */}
      <div className="flex w-[20%] flex-col overflow-hidden rounded-l-lg bg-white p-6 dark:bg-gray-950">
        <Accordion type="single" collapsible className="flex-1">
          {Object.entries(modulesBySection).map(([section, modules], index) => (
            <AccordionItem key={section} value={`section-${index + 1}`}>
              <AccordionTrigger className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{section}</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-center gap-2">
                      <Checkbox checked={false /* Handle completion */} />
                      <span>{module.title}</span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
