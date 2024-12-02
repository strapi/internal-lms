import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { fetchHomePageData } from "@/lib/queries/appQueries";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserNav from "@/components/UserNav";
import ThemeToggle from "@/components/ui/theme-toggle";
import Drawer from "@/components/Drawer";

export const Route = createFileRoute("/_dashboardLayout")({
  component: () => <DashboardLayout />,
  loader: ({ context: { queryClient } }) => {
    const query = queryClient.ensureQueryData({
      queryKey: ["dashboard"],
      queryFn: fetchHomePageData,
    });

    return query;
  },
});

export const DashboardLayout: React.FC = () => {
  return (
    <div className="flex">
      <Drawer />

      <div className="w-[100%] pl-64">
        <div className="flex items-center justify-between py-4 px-8">
          <h2 className="text-3xl font-semibold">Strapi Learning</h2>

          <div className="flex items-center justify-end gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 transform text-gray-500" />
              <Input type="text" placeholder="Search" value="" className="pl-10" />
            </div>

            <Bell />
            <UserNav />
            <ThemeToggle />
          </div>
        </div>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
