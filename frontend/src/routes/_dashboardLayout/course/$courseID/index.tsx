import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/course/$courseID/')({
  // In a loader
  loader: ({ params }) => params.courseId,
  component: PostComponent,
})

function PostComponent() {
  const { courseID } = Route.useParams()
  return <div>Post ID: { courseID }</div>
}
