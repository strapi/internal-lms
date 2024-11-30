import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import { FaCog, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { FaIdBadge } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

// Utility to format username (e.g., "alex.bennett" to "Alex Bennett")
const formatUsername = (username: string | null): string => {
  if (!username) return "User"; // Fallback for null or undefined usernames
  return username
    .split(".") // Split by "."
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)) // Capitalize each part
    .join(" "); // Join parts with a space
};

export default function UserNav() {
  const { authState } = useContext(AuthContext);
  const { username } = authState;

  const formattedUsername = formatUsername(username); // Format the username

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <FaUserCircle className="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Welcome {formattedUsername}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={"/settings"} className="flex">
              <FaCog className="mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={"/profile"} className="flex">
              <FaIdBadge className="mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <hr className="my-2" />
          <DropdownMenuItem>
            <Link to={"/"} className="flex">
              <FaSignOutAlt className="mr-2" />
              Sign Out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
