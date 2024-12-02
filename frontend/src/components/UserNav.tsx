import { useContext } from "react";
import { AuthContext } from "@/context/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { Badge, Cog, LogOut, User } from "lucide-react";

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
          <User className="h-6 w-6" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Welcome {formattedUsername}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link to={"/settings"} className="flex">
              <Cog className="mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={"/profile"} className="flex">
              <Badge className="mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <hr className="my-2" />
          <DropdownMenuItem>
            <Link to={"/"} className="flex">
              <LogOut className="mr-2" />
              Sign Out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
