import { User } from "@/types/userTypes";

export default function getUserData() {
  return localStorage.getItem("userData")
    ? (JSON.parse(localStorage.getItem("userData")!) as User)
    : ({} as User);
}
