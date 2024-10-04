import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./context/theme";
import router from "./providers/router-provider";
import { AuthProvider } from "./context/auth";
import { useAuth } from "./hooks/useAuth";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <InnerApp />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

const InnerApp = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

export default App;
