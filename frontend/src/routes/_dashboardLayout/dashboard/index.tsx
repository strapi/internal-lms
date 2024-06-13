import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/dashboard/')({
  component: () => <div>Hello /dashboard/!</div>
})