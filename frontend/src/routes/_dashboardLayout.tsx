import React from "react";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserNav from "@/components/UserNav";
import ThemeToggle from "@/components/ui/theme-toggle";
import Drawer from "@/components/Drawer";

export const Route = createFileRoute("/_dashboardLayout")({
  component: () => <DashboardLayout />,
});

export const DashboardLayout: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="flex">
      <Drawer />

      <div className="w-[100%] pl-64">
        <div className="flex items-center justify-between px-8 py-4">
          <h2 className="text-4xl font-semibold text-black dark:text-white">
            Strapi Learning
          </h2>

          <div className="flex items-center justify-end gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 transform text-gray-500" />
              <Input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </form>
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
