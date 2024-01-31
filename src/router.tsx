import { createBrowserRouter } from "react-router-dom";
import FinanciamentoxAvista from "./pages/financiamento/financiamentoxavista";

const router = createBrowserRouter([
  {
    path: "/",
    element: <></>,
  },
  {
    path: "/financiamentoxavista",
    element: <FinanciamentoxAvista />,
  },
]);

export default router;
