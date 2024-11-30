import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./context/theme";
import router from "./providers/router-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/queryClient";
import { AuthProvider } from "@/context/auth"; 

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <InnerApp />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

const InnerApp = () => {
  return <RouterProvider router={router} />;
};

export default App;
