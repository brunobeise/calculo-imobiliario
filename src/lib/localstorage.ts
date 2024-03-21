import { UserData } from "@/pages/userConfig";

export default function getUserData(){
    return localStorage.getItem("userData")
        ? JSON.parse(localStorage.getItem("userData")!) as UserData
        : {} as UserData;
}