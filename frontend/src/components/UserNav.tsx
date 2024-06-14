import { FaCog, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { FaIdBadge, FaLaptopCode } from 'react-icons/fa6';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Link } from '@tanstack/react-router';


export default function UserNav() {

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FaUserCircle className='w-6 h-6' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Welcome First name</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={ "/settings" } className="flex">
              <FaCog className='mr-2' />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={ "/profile" } className="flex">
              <FaIdBadge className='mr-2' />
              Profile
            </Link>
          </DropdownMenuItem>
          <hr className='my-2' />
          <DropdownMenuItem>
            <Link to={ "/course/create" } className="flex">
              <FaLaptopCode className='mr-2' />
              Create A course
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={ "/" } className="flex">
              <FaSignOutAlt className='mr-2' />Sign Out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  )
}
