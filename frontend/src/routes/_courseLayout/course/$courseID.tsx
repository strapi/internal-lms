import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_courseLayout/course/$courseID')({
  // In a loader
  loader: ({ params }) => params.courseID,
  component: PostComponent,
})

function PostComponent() {
  const { courseID } = Route.useParams()
  return <div>Post ID: { courseID }</div>
}
