import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/_user/profile')({
  component: () => <div>Hello /_dashboardLayout/_user/profile/!</div>
})