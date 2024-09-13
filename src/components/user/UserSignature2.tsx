import { UserData } from "@/pages/UserConfig";
import { userService } from "@/service/userService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Loading from "react-loading";

interface UserSignatureProps {
  userData?: UserData;
  title?: string;
  desc?: string;
  getUser?: boolean;
}

export default function UserSignature2(props: UserSignatureProps) {
  const [userSaved, setUserSaved] = useState<UserData>();

  useEffect(() => {
    if (props.getUser) {
      const storedUserData = localStorage.getItem("userData");

      if (storedUserData) {
        setUserSaved(JSON.parse(storedUserData));
      } else {
        userService.getUserData().then((data) => {
          setUserSaved(data);
          localStorage.setItem("userData", JSON.stringify(data));
        });
      }
    }
  }, [props.getUser]);

  const data: UserData = {
    fullName: props.userData?.fullName || userSaved?.fullName,
    logo: props.userData?.logo || userSaved?.logo,
    logo2: props.userData?.logo2 || userSaved?.logo2,
    photo: props.userData?.photo || userSaved?.photo,
    role: props.userData?.role || userSaved?.role,
    creci: props.userData?.creci || userSaved?.creci,
    address: props.userData?.address || userSaved?.address,
    phone: props.userData?.phone || userSaved?.phone,
    whatsapp: props.userData?.whatsapp || userSaved?.whatsapp,
    instagram: props.userData?.instagram || userSaved?.instagram,
    facebook: props.userData?.facebook || userSaved?.facebook,
    linkedin: props.userData?.linkedin || userSaved?.linkedin,
  };

  return (
    <div className="text-white bg-primary p-5 rounded w-full ">
      {props.getUser && !userSaved ? (
        <div className="h-[110px] flex items-center justify-center w-full ">
          <Loading type="spin" color={"#ffffff"} width={30} height={30} />
        </div>
      ) : (
        <div className="flex items-center h-[110px] ps-10">
          <div className="w-[90px] h-[90px]">
            <img
              className="w-full h-full rounded-full overflow-hidden flex items-center justify-center translate-x-[15px] bg-primary"
              src={
                data.logo2 ||
                "https://res.cloudinary.com/dpegpgjpr/image/upload/v1722019585/s71bo47g6jxzo88gh5x1.png"
              }
              alt=""
            />
          </div>
          <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex items-center justify-center border-2 border-white">
            <img
              className="w-full h-full object-cover object-center"
              src={
                data.photo ||
                "https://res.cloudinary.com/dr9bi47aq/image/upload/v1726154180/r20tb0lgt0duwjn51khq.webp"
              }
              alt=""
            />
          </div>

          <div className="w-[400px] ms-5">
            <div className="grid grid-rows">
              <h3 className="text-2xl text-white mb-1">
                <strong>{props.title || "Plano de Aquisição"} </strong>
              </h3>
              <p className="text-lg">
                {props.desc || "Casa de Alvenaria no Bell Ville"}
              </p>
              <div className="bg-white w-full h-[1.2px] my-2"></div>
              <span className="text-sm">
                <strong>{data.fullName?.toUpperCase()} </strong>{" "}
                <span className="ms-2 font-light">CRECI {data.creci}</span>
                <span className="ms-2">{dayjs().format("DD/MM/YY")}</span>
              </span>{" "}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
