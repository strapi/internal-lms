import UserNav from '@/components/UserNav';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { FaBell } from 'react-icons/fa';
import strapiLogo from '../assets/strapi-logo.svg'
import { Input } from '@/components/ui/input';

export const Route = createFileRoute('/_dashboardLayout')({
  component: () => <DashboardLayout />,
});

export const DashboardLayout = () => {
  return (
    <div>
      <div className="p-2 flex justify-between items-center m-2">
        <div className="flex gap-2 items-center">
          <img
            src={ strapiLogo }
            width={ 128 }
            height={ 128 }
            alt="Logo"
            className="h-8 w-8"
          />
          <Link to="/auth" className="[&.active]:font-bold">
            Auth
          </Link>{ ' ' }
          <Link to="/dashboard" className="[&.active]:font-bold">
            Dashboard
          </Link>
          <Link to="/courses" className="[&.active]:font-bold">
            Courses
          </Link>
        </div>
        <div className="flex gap-2 items-center">
          <Input placeholder="Search..." />
          <FaBell className='w-6 h-6' />
          <UserNav />
        </div>
      </div>
      <hr />
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
}
