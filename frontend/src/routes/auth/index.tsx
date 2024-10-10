import Login from "@/components/Login";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
  component: Login,
  beforeLoad: () => {
    localStorage.clear(); // remove all auth data
  },
});
