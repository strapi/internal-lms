import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen";
import queryClient from "@/lib/queryClient";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreloadStaleTime: 0,
  defaultPreload: "intent",
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;
