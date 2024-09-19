// services/errorHandler.ts
import { notify } from "@/notify";
import Cookies from "js-cookie";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleApiError(error: any, defaultErrorMessage: string) {
  if (error.response?.data?.authError) {
    Cookies.remove("token");
    window.location.reload();
  }
  notify("error", error.response?.data?.error || defaultErrorMessage);
  throw new Error(defaultErrorMessage + ": " + error.message);
}
