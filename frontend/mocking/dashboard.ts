import { Course } from "@interfaces/course";
import { faker } from "@faker-js/faker";

export function generateCourses(count: number = 5): Course[] {
  const courses: Course[] = [];
  for (let i = 0; i < count; i++) {
    const randomImageNumber = faker.datatype.number({ min: 1, max: 1000 });
    courses.push({
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      photo: `https://placedog.net/${randomImageNumber}`,
      progress: faker.number.int({ min: 0, max: 100 }),
      subtitle: faker.lorem.words(3),
    });
  }
  return courses;
}
