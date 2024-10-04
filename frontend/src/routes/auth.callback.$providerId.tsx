import Spinner from "@/components/ui/Spinner";
import { createFileRoute } from "@tanstack/react-router";
import queryClient from "@/lib/queryClient";

export const Route = createFileRoute("/auth/callback/$providerId")({
  loader: async ({ context: { queryClient } }) => {},
  beforeLoad: async (ctx) => {},

  component: () => {
    return (
      <div>
        <Spinner text="Please wait..." />
      </div>
    );
  },
});
