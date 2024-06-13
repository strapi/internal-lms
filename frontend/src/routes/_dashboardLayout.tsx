import { Input } from '@/components/ui/input';
import UserNav from '@/components/UserNav';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { FaBell, FaSearch } from 'react-icons/fa';
import strapiLogo from '../assets/strapi-logo.svg';
export const Route = createFileRoute('/_dashboardLayout')({
  component: () => <DashboardLayout />,
});

export const DashboardLayout = () => {

  return (
    <div>
      <div className="p-2 flex justify-between items-center m-2">
        <div className="flex gap-2 items-center">
          <Link to="/dashboard" className='w-8 h-8 mr-2'>
            <img
              src={ strapiLogo }
              alt="Logo"
            />
          </Link>
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
        { }
        <div className="flex items-center gap-4 w-full justify-end">
          <div className="relative w-1/3">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10" />
            <Input
              type="text"
              placeholder="Search"
              className="pl-10 pr-3 py-2 text-md w-full border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6E23DD] focus:border-transparent"
              value=""
            />
          </div>
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
