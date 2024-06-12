import { Course } from '@interfaces/course';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Card } from './ui/card';

interface GalleryCardsProps {
  galleryItems: Partial<Course>[];
}

export const GalleryCards: React.FC<GalleryCardsProps> = ({ galleryItems }) => {
  return (

    <Swiper
      modules={ [Navigation, Pagination] }
      spaceBetween={ 10 }
      slidesPerView={ 5 }
      navigation
      pagination={ { clickable: true } }
      className="w-full"
    >
      { galleryItems.map((item) => (
        <SwiperSlide key={ item.id } className="flex justify-center">
          <Card className="p-4 rounded-lg shadow-lg">
            <img
              src={ item.photo }
              alt="Gallery Image"
              className="w-full h-32 object-cover rounded-t-lg"
            />
            <div className="mt-4">
              <h4 className="text-lg font-bold">{ item.title }</h4>
              <p className="text-gray-500 mt-1">{ item.subtitle }</p>
            </div>
          </Card>
        </SwiperSlide>
      )) }
    </Swiper>
  );
};
