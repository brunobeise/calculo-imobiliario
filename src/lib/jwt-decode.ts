// Importação
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function decodeToken() {
  const token = Cookies.get("token");
  const decodedToken = jwtDecode(token || "");
  return decodedToken as {
    userId: string;
    owner: boolean;
  };
}
