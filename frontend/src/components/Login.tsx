import { FcGoogle } from 'react-icons/fc'
import { Button } from './ui/button'
import strapiLogo from '../assets/strapi-logo.svg'
import { useNavigate } from '@tanstack/react-router';

export default function Login() {
  const naviate = useNavigate();
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome to Strapi LMS!</h1>
        <p className="text-gray-500 dark:text-gray-400">Unlock Learning, Strapi Style!</p>
      </div>
      <div className="mx-4 flex max-w-2xl flex-col items-center space-y-6 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-32 w-32 overflow-hidden rounded-full">
            <img
              src={ strapiLogo }
              width={ 128 }
              height={ 128 }
              alt="User Avatar"
              className="h-full w-full object-cover"
            />
          </div>

        </div>
        <Button variant="outline" className="w-full" onClick={ () => naviate({ to: '/dashboard' }) }>
          <FcGoogle className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </div>
    </div>
  )
}
