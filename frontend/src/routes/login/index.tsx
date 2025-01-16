import Login from "@/components/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  component: Login,
  beforeLoad: () => {
    // Clear authentication state before loading login page
    localStorage.clear();
  },
});
