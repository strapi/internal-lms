import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboardLayout/_user/settings')({
  component: () => <div>Hello /_dashboardLayout/_user/settings/!</div>
})