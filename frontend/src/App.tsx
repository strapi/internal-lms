import { RouterProvider } from "@tanstack/react-router";
import "./App.css";
import router from "./providers/router-provider";
// import Login from './components/Login'
// import { Button } from './components/ui/button'

const App = () => {
  return <InnerApp />;
};

const InnerApp = () => {
  // const auth = useAuth()
  return <RouterProvider router={router} />;
};

export default App;
