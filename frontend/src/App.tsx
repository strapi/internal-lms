import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./context/theme";
import router from "./providers/router-provider";
import { AuthProvider } from "./context/auth";
import { useAuth } from "./hooks/useAuth";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </AuthProvider>
  );
};

const InnerApp = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};

export default App;
