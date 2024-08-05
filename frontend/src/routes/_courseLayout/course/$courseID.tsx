import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Course } from '@/interfaces/course'
import { generateCourses } from '@mock/courses'
import { createFileRoute } from '@tanstack/react-router'
import { PlayIcon } from 'lucide-react'

export const Route = createFileRoute('/_courseLayout/course/$courseID')({
  loader: ({ params }) => {
    const courses = generateCourses(1);
    const course = courses[0]; // Get the first (and only) course
    return { course, courseID: params.courseID }
  },
  component: SingleCourse,
})

export default function SingleCourse() {
  const { course } = Route.useLoaderData<{ course: Course, courseID: string }>();
  console.log(course);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 overflow-hidden rounded-r-lg bg-gray-100 dark:bg-gray-900 h-[70%]">
        <div className="relative h-full w-full">
          <div className="absolute inset-0 overflow-hidden">
            <video className="h-full w-full object-cover">
              <source
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
                type="video/mp4"
              />
            </video>
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center">
            <Button
              variant="ghost"
              size="lg"
              className="rounded-full bg-white/20 p-4 text-white hover:bg-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <PlayIcon className="h-8 w-8" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-4 text-white">
            <h3 className="text-lg font-bold">{ course.title }</h3>
            <p className="text-sm">
              { course.description }
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-[20%] flex-col overflow-hidden rounded-l-lg bg-white p-6 dark:bg-gray-950">
        <Accordion type="single" collapsible className="flex-1">
          { course.sections.map((section, index) => (
            <AccordionItem key={ section.id } value={ `item-${index + 1}` }>
              <AccordionTrigger className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{ section.title }</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  { section.modules.map((module) => (
                    <div key={ module.id } className="flex items-center gap-2">
                      <Checkbox checked={ module.completed } />
                      <span>{ module.title }</span>
                    </div>
                  )) }
                </div>
              </AccordionContent>
            </AccordionItem>
          )) }
        </Accordion>
      </div>
    </div>
  )
}
