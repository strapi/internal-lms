import { Input } from "@/components/ui/input";
import UserNav from "@/components/UserNav";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { FaBell, FaSearch } from "react-icons/fa";
import strapiLogo from "../assets/strapi-logo.svg";
import ThemeToggle from "@/components/ui/theme-toggle";
export const Route = createFileRoute("/_dashboardLayout")({
  component: () => <DashboardLayout />,
});

export const DashboardLayout = () => {
  return (
    <div>
      <div className="m-2 flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="mr-2 h-8 w-8">
            <img src={strapiLogo} alt="Logo" />
          </Link>
          <Link to="/auth" className="[&.active]:font-bold">
            Auth
          </Link>{" "}
          <Link to="/dashboard" className="[&.active]:font-bold">
            Dashboard
          </Link>
          <Link to="/courses" className="[&.active]:font-bold">
            Courses
          </Link>
        </div>
        {}
        <div className="flex w-full items-center justify-end gap-4">
          <div className="relative w-1/3">
            <FaSearch className="absolute left-3 top-1/2 z-10 -translate-y-1/2 transform text-gray-500" />
            <Input
              type="text"
              placeholder="Search"
              className="text-md w-full rounded border border-gray-300 py-2 pl-10 pr-3 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#6E23DD]"
              value=""
            />
          </div>
          <FaBell className="h-6 w-6" />
          <UserNav />
          <ThemeToggle />
        </div>
      </div>
      <hr />
      <main className="p-2">
        <Outlet />
      </main>
    </div>
  );
};
