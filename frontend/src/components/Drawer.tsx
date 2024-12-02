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

const Drawer: React.FC = () => {
  return (
    <div
      id="drawer-navigation"
      className="fixed flex h-screen w-64 flex-col overflow-y-auto rounded-tr-3xl bg-white pb-4 pl-4 pt-12 dark:bg-gray-800"
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
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Goal />
              <span className="ml-3">Goals</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Boxes />
              <span className="ml-3">Catalogue</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <LineChart />
              <span className="ml-3">Surveys</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Network />
              <span className="ml-3">Organization</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <LibraryBig />
              <span className="ml-3">Resources</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <MessageCircleWarning />
              <span className="ml-3">Reports</span>
            </Link>
          </li>
        </ul>
      </div>
      {/* Secondary menu */}
      <div className="mt-auto py-4">
        <ul className="space-y-2 font-medium">
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <Cog />
              <span className="ml-3">Admin</span>
            </Link>
          </li>
          <li>
            <Link
              to="/"
              className="group flex items-center rounded-l-3xl p-2 pl-4 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:[&.active]:bg-gray-700"
            >
              <HelpCircle />
              <span className="ml-3">Help</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
