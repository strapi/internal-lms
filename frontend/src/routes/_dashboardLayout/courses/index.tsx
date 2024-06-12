import React, { useState } from 'react';
import { CourseCards } from '@/components/CourseCards';
import { categories, generateCourses } from '@mock/courses';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboardLayout/courses/')({
  component: () => <CoursesPage />,
});

function CoursesPage() {
  const courses = generateCourses(20);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCourses = selectedCategory
    ? courses.filter(course => course.category === selectedCategory)
    : courses;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
      {/* Categories List */ }
      <div className="order-1 md:order-2 md:col-span-1 bg-gray-100 p-6 rounded-lg shadow-md space-y-4">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul className="space-y-4">
          <li>
            <button
              onClick={ () => setSelectedCategory(null) }
              className={ `w-full text-left p-2 rounded-lg ${selectedCategory === null ? 'bg-blue-500 text-white' : 'bg-white text-black'}` }
            >
              Show All
            </button>
          </li>
          { categories.map(category => (
            <li key={ category }>
              <button
                onClick={ () => setSelectedCategory(category) }
                className={ `w-full text-left p-2 rounded-lg ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-white text-black'}` }
              >
                { category }
              </button>
            </li>
          )) }
        </ul>
      </div>
      {/* CourseCards */ }
      <div className="order-2 md:order-1 md:col-span-4">
        <CourseCards courses={ filteredCourses } showProgress={ false } />
      </div>
    </div>
  );
}
