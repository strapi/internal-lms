import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./context/theme";
import router from "./providers/router-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const InnerApp = () => {
  return <RouterProvider router={router} />;
};

export default App;
