import UserNav from '@/components/UserNav';
import { createFileRoute, Link, Outlet } from '@tanstack/react-router';
import { FaBell, FaStar } from 'react-icons/fa';
import strapiLogo from '../assets/strapi-logo.svg';

export const Route = createFileRoute('/_courseLayout')({

  component: () => <CourseLayout />,
});

export const CourseLayout = () => {
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
        </div>
        <h2 className="text-xl font-bold w-full">Course Name</h2>
        <div className="flex items-center gap-4 w-full justify-end">
          <div className="flex">
            <FaStar className='w-6 h-6 mr-2' />Leave a rating
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
};
