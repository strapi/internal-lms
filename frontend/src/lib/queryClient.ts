import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Disable refetch on window focus
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default queryClient;
