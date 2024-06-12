import { Chapter, Course, Module } from "@interfaces/course";
import { faker } from "@faker-js/faker";

export const categories = [
  "Category 1",
  "Category 2",
  "Category 3",
  "Category 4",
  "Category 5",
  "Category 6",
];

export function generateCourses(count: number = 5): Course[] {
  const courses: Course[] = [];
  for (let i = 0; i < count; i++) {
    const randomImageNumber = faker.number.int({ min: 1, max: 1000 });
    const randomCategory =
      categories[faker.number.int({ min: 0, max: categories.length - 1 })];

    const sections: Chapter[] = [];
    const sectionCount = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < sectionCount; j++) {
      const checklists: Module[] = [];
      const checklistCount = faker.number.int({ min: 1, max: 10 });
      for (let k = 0; k < checklistCount; k++) {
        checklists.push({
          id: faker.string.uuid(),
          title: faker.lorem.words(2),
          completed: faker.datatype.boolean(),
        });
      }
      sections.push({
        id: faker.string.uuid(),
        title: faker.lorem.words(3),
        checklists: checklists,
      });
    }

    courses.push({
      id: faker.string.uuid(),
      title: faker.lorem.words(3),
      description: faker.lorem.sentences(2),
      photo: `https://placedog.net/${randomImageNumber}`,
      progress: faker.number.int({ min: 0, max: 100 }),
      subtitle: faker.lorem.words(3),
      category: randomCategory,
      sections: sections,
    });
  }
  return courses;
}
