import { Card } from '@/components/ui/card';
import { Course } from '@interfaces/course';

interface CourseCardsProps {
  courses: Course[];
  showProgress?: boolean;
}

export const CourseCards: React.FC<CourseCardsProps> = ({ courses, showProgress }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      { courses.map((course) => (
        <Card key={ course.id } className="p-6 rounded-lg shadow-lg">
          <img
            src={ course.photo }
            alt="Card Image"
            width={ 600 }
            height={ 400 }
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="mt-4">
            <h3 className="text-xl font-bold">{ course.title }</h3>
            <p className="text-gray-500 mt-2">{ course.subtitle }</p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                { showProgress && (
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={ { width: `${course.progress}%` } }
                  />
                ) }
              </div>
            </div>
          </div>
        </Card>
      )) }
    </div>
  );
};
