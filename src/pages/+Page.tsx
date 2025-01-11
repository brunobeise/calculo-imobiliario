import "react-toastify/dist/ReactToastify.css";

export interface Route {
  title: string;
  href: string;
  description: string;
  element: JSX.Element;
}

import { useAuth } from "../auth";
import Login from "../pages/Login";
import { navigate } from "vike/client/router";

export default function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) navigate("/dashboard");
  else return <Login />;
}
