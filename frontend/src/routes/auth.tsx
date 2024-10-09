import AuthIndex from "@/components/AuthIndex";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthIndex,
});
