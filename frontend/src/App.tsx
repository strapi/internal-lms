import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

const InnerApp = () => {
  return <RouterProvider router={router} />;
};

export default App;
