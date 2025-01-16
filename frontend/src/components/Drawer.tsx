import React from "react";
import { Link } from "@tanstack/react-router";
import strapiLogo from "../assets/strapi-logo.svg";
import {
  Book,
  Boxes,
  Cog,
  Goal,
  HelpCircle,
  Home,
  LibraryBig,
  LineChart,
  MessageCircleWarning,
  Network,
} from "lucide-react";
import { STRAPI_URL } from "@/lib/utils";

const Drawer: React.FC = () => {
  return (
    <div
      id="drawer-navigation"
      className="fixed flex h-screen w-64 flex-col overflow-y-auto rounded-tr-3xl border bg-white pb-4 pl-4 pt-12 dark:bg-gray-800"
    >
      <div className="flex flex-wrap justify-center">
        <Link to="/dashboard">
          <img src={strapiLogo} alt="Strapi Logo" className="w-20" />
        </Link>
      </div>
      <div className="py-12">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/dashboard"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Home />
              <span className="ml-3">Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/courses"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Book />
              <span className="ml-3">Courses</span>
            </Link>
          </li>
          <li>
            <Link
              to="/categories"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Boxes />
              <span className="ml-3">Categories</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 opacity-55 dark:text-white dark:[&.active]:bg-gray-700"
            >
              <Goal />
              <div className="flex flex-col">
                <span className="ml-3">Goals</span>
                <span className="ml-3 text-xs">Coming soon</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 opacity-55 dark:text-white dark:[&.active]:bg-gray-700"
            >
              <LineChart />
              <div className="flex flex-col">
                <span className="ml-3">Surveys</span>
                <span className="ml-3 text-xs">Coming soon</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 opacity-55 dark:text-white dark:[&.active]:bg-gray-700"
            >
              <Network />
              <div className="flex flex-col">
                <span className="ml-3">Organization</span>
                <span className="ml-3 text-xs">Coming soon</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 opacity-55 dark:text-white dark:[&.active]:bg-gray-700"
            >
              <LibraryBig />
              <div className="flex flex-col">
                <span className="ml-3">Resources</span>
                <span className="ml-3 text-xs">Coming soon</span>
              </div>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 opacity-55 dark:text-white dark:[&.active]:bg-gray-700"
            >
              <MessageCircleWarning />
              <div className="flex flex-col">
                <span className="ml-3">Reports</span>
                <span className="ml-3 text-xs">Coming soon</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      {/* Secondary menu */}
      <div className="mt-auto py-4">
        <ul className="space-y-2 font-medium">
          <li>
            <a
              href={STRAPI_URL + "/admin"}
              target={"_blank"}
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Cog />
              <span className="ml-3">Admin</span>
            </a>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 opacity-55 dark:text-white dark:[&.active]:bg-gray-700"
            >
              <HelpCircle />
              <div className="flex flex-col">
                <span className="ml-3">Help</span>
                <span className="ml-3 text-xs">Coming soon</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
