import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/courses/')({
  component: () => <div>Hello /_dashboard/courses/!</div>
})