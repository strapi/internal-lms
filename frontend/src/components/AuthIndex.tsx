import { Outlet } from "@tanstack/react-router";

const AuthIndex = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-gray-950">
      <Outlet />
    </div>
  );
};

export default AuthIndex;
