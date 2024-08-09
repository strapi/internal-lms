import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider } from "./context/theme";
import router from "./providers/router-provider";

const App = () => {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
};

const InnerApp = () => {
  // const auth = useAuth()
  return <RouterProvider router={router} />;
};

export default App;
