import { Course } from '@/interfaces/course';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Card } from './ui/card';
import { Link } from '@tanstack/react-router';

interface GalleryCardsProps {
  galleryItems: Partial<Course>[];
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
      {galleryItems.map((item) => (
        <SwiperSlide key={item.id} className="flex justify-center min-h-max">
          <Link to={`/course/${item.id}`}>
            <Card className="p-4 rounded-lg aspect-square shadow-lg flex flex-col">
              <img
                src={item.photo}
                alt="Gallery Image"
                className="aspect-auto h-1/2 object-cover rounded-t-lg"
              />
              <div className="flex flex-col mt-4 overflow-auto h-1/2">
                <h4 className="text-lg font-bold flex-shrink-0 truncate">{item.title}</h4>
                <p className="text-gray-500 mt-1 break-words">{item.subtitle}</p>
              </div>
            </Card>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
