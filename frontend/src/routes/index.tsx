import { getAuthData } from "@/hooks/getAuthData";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const authData = getAuthData();

    // Redirect based on authentication state
    if (!authData) {
      throw redirect({ to: "/login" });
    } else {
      throw redirect({ to: "/dashboard" });
    }
  },
});
