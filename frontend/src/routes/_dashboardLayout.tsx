import { createFileRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_dashboardLayout')({
  component: () => <DashboardLayout />,
});


export const DashboardLayout = () => {
  return (
    <div>
      <div className="p-2 flex gap-2">
        <Link to="/auth" className="[&.active]:font-bold">
          Auth
        </Link>{ ' ' }
        <Link to="/dashboard" className="[&.active]:font-bold">
          Dashboard
        </Link>
        <Link to="/courses" className="[&.active]:font-bold">
          Courses
        </Link>
        <Link to="/course/123" className="[&.active]:font-bold">
          Course
        </Link>
      </div>
      <hr />
      <Outlet />
    </div>
  );
}
