import { getAuthData } from "@/hooks/getAuthData";
import { createFileRoute, Navigate, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const authData = getAuthData();
    if (!authData) {
      throw redirect({ to: "/auth" });
    } else {
      throw redirect({ to: "/dashboard" });
    }
  },
});
