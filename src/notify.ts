// notify.ts
import { toast } from "react-toastify";

export const notify = (
  type: "success" | "info" | "error" | "warning",
  message: string
) => {
  toast[type](message);
};
