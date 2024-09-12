import { UserData } from "@/pages/UserConfig";

export default function getUserData(){
    return localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData")!) as UserData
        : {} as UserData;
}