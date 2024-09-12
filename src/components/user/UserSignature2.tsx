import { UserData } from "@/pages/UserConfig";
import dayjs from "dayjs";

interface UserSignatureProps {
  userData?: UserData;
  title?: string;
  desc?: string;
}

export default function UserSignature2(props: UserSignatureProps) {
  const userSaved: UserData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")!)
    : {};

  const data: UserData = {
    name: props.userData?.name || userSaved.name,
    logo: props.userData?.logo || userSaved.logo,
    logo2: props.userData?.logo2 || userSaved.logo2,
    agentPhoto: props.userData?.agentPhoto || userSaved.agentPhoto,
    office: props.userData?.office || userSaved.office,
    creci: props.userData?.creci || userSaved.creci,
    address: props.userData?.address || userSaved.address,
    telephone: props.userData?.telephone || userSaved.telephone,
    whatsapp: props.userData?.whatsapp || userSaved.whatsapp,
    instagram: props.userData?.instagram || userSaved.instagram,
    facebook: props.userData?.facebook || userSaved.facebook,
    linkedin: props.userData?.linkedin || userSaved.linkedin,
  };

  return (
    <div className="text-white bg-primary p-5 rounded">
      <div className="flex items-center">
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
            className="w-full h-full"
            src={
              data.agentPhoto ||
              "https://res.cloudinary.com/dpegpgjpr/image/upload/v1722019586/mvrbmcisqssgisd8lydp.png"
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
              <strong>{data.name?.toUpperCase()} </strong>{" "}
              <span className="ms-2 font-light">CRECI {data.creci}</span>
              <span className="ms-2">{dayjs().format("DD/MM/YY")}</span>
            </span>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
