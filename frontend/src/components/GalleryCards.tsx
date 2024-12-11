import { Course } from "@/interfaces/course";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Card } from "./ui/card";
import { Link } from "@tanstack/react-router";

const IMAGE_URL = import.meta.env.VITE_STRAPI_IMAGE_URL;

interface GalleryCardsProps {
  galleryItems: Pick<
    Course,
    "id" | "slug" | "title" | "synopsis" | "thumbnail" | "sections"
  >[];
}

export const GalleryCards: React.FC<GalleryCardsProps> = ({ galleryItems }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={10}
      slidesPerView={5}
      navigation
      pagination={{ clickable: true }}
      className="w-full"
    >
      {galleryItems.map((item) => {
        const totalSections = item.sections?.length || 0;
        const totalModules =
          item.sections?.reduce(
            (count, section) => count + (section.modules?.length || 0),
            0,
          ) || 0;

        return (
          <SwiperSlide key={item.id} className="flex min-h-max justify-center">
            <Link to={`/courses/${item.slug}`} className="block w-full">
              <Card className="flex h-full flex-col rounded-lg p-4 shadow-lg">
                {/* Image Section */}
                {item.thumbnail ? (
                  <img
                    src={`${IMAGE_URL}/${item.thumbnail.url}`}
                    alt={`${item.title} Thumbnail`}
                    className="h-48 w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center rounded-t-lg bg-gray-200">
                    <p className="text-gray-500">No Image</p>
                  </div>
                )}

                {/* Content Section */}
                <div className="flex flex-1 flex-col justify-between pt-4">
                  <div>
                    <h3 className="truncate text-lg font-bold">
                      {item.title || "Untitled Course"}
                    </h3>
                    {item.synopsis && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                        {item.synopsis}
                      </p>
                    )}
                  </div>

                  {/* Sections/Modules Info */}
                  <div className="pt-4 mt-auto text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {totalSections}{" "}
                    {totalSections === 1 ? "Section" : "Sections"} |{" "}
                    {totalModules} {totalModules === 1 ? "Module" : "Modules"}
                  </div>
                </div>
              </Card>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};
