import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Course } from "@/interfaces/course";
import { createFileRoute } from "@tanstack/react-router";
import qs from "qs";
import MuxPlayer from "@mux/mux-player-react";

const API_URL = import.meta.env.VITE_STRAPI_API_URL;
const API_TOKEN = import.meta.env.VITE_STRAPI_API_KEY;

if (!API_URL || !API_TOKEN) {
  throw new Error("API_URL or API_TOKEN is missing. Check your .env file.");
}

export const Route = createFileRoute("/_courseLayout/course/$courseID")({
  loader: async ({ params }) => {
    const query = qs.stringify(
      {
        fields: ["title", "description"],
        populate: {
          thumbnail: { populate: "*" },
          categories: { populate: "*" },
          section: {
            populate: {
              modules: {
                populate: {
                  media: {
                    populate: "*",
                  },
                },
              },
            },
          },
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
  const [playbackToken, setPlaybackToken] = useState<string | null>(null);

  // Get the first playable video playback_id
  const firstPlaybackId = course.section
    ?.flatMap((section) => section.modules)
    .find((module) => module.media?.playback_id)?.media?.playback_id;

  // Fetch the token from the Strapi endpoint
  useEffect(() => {
    const fetchMuxToken = async () => {
      if (!firstPlaybackId) return;

      try {
        // Get the local session JWT from storage (adjust based on your auth method)
        const userJwt = localStorage.getItem("jwt"); // Assuming JWT is stored in localStorage

        if (!userJwt) {
          throw new Error("User is not authenticated.");
        }

        const response = await fetch(`${API_URL}/mux-token`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${userJwt}`, // Include the user's JWT
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ playbackId: firstPlaybackId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Mux token");
        }

        const { token } = await response.json();
        setPlaybackToken(token);
      } catch (error) {
        console.error("Error fetching Mux token:", error);
      }
    };

    fetchMuxToken();
  }, [firstPlaybackId]);

  if (!course) {
    return <div>Loading...</div>;
  }

  const poster = course.thumbnail?.url || "";

  return (
    <div className="flex h-screen w-full">
      {/* Video Section */}
      <div className="h-[70%] flex-1 overflow-hidden rounded-r-lg bg-gray-100 dark:bg-gray-900">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 overflow-hidden">
            {firstPlaybackId && playbackToken ? (
              <MuxPlayer
                playbackId={firstPlaybackId}
                playback-token={playbackToken}
                metadata={{
                  video_id: `mux-video-${firstPlaybackId}`,
                  video_title: course.title,
                }}
                poster={poster}
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
          {course.section?.map((section) => (
            <AccordionItem key={section.id} value={`section-${section.id}`}>
              <AccordionTrigger className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{section.name}</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {section.modules.map((module) => (
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
