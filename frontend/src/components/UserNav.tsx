import { useContext } from "react";
import { useNavigate } from "@tanstack/react-router";
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
import { formatUsername } from "@/lib/utils";

export default function UserNav() {
  const { authState, actions } = useContext(AuthContext);
  const { user } = authState;

  const navigate = useNavigate(); // Initialize navigation hook

  // Format username with a fallback
  const formattedUsername = user?.username
    ? formatUsername(user.username)
    : "Guest";

  const handleLogout = async () => {
    actions.setJwt(null); // Clear the authentication token
    navigate({ to: "/login" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <User className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Welcome {formattedUsername}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link to="/settings" className="flex">
            <Cog className="mr-2" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/profile" className="flex">
            <Badge className="mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        <hr className="my-2" />
        <DropdownMenuItem onClick={handleLogout}>
          <div className="flex">
            <LogOut className="mr-2" />
            Sign Out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
