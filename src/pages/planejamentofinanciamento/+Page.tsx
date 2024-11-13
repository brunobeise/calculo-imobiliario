import FinancingPlanning from "./@id/+Page";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";


export default function Page() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }
  return <FinancingPlanning />;
}
