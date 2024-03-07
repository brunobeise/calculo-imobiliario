import {
  FaFacebookSquare,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";
import { Button } from "./ui/button";
import { UserData } from "@/pages/userConfig";
import { Link } from "react-router-dom";

interface UserSignatureProps {
  userData?: UserData;
}

export default function UserSignature(props: UserSignatureProps) {
  const userSaved: UserData = localStorage.getItem("userData")
    ? JSON.parse(localStorage.getItem("userData")!)
    : {};

  const data: UserData = {
    name: props.userData?.name || userSaved.name,
    logo: props.userData?.logo || userSaved.logo,
    office: props.userData?.office || userSaved.office,
    creci: props.userData?.creci || userSaved.creci,
    address: props.userData?.address || userSaved.address,
    telephone: props.userData?.telephone || userSaved.telephone,
    whatsapp: props.userData?.whatsapp || userSaved.whatsapp,
    instagram: props.userData?.instagram || userSaved.instagram,
    facebook: props.userData?.facebook || userSaved.facebook,
    linkedin: props.userData?.linkedin || userSaved.linkedin,
  };

  function formatPhoneNumber(phoneNumber: string) {
    const phoneStr = phoneNumber.toString();
    if (phoneStr.length === 11) {
      const areaCode = phoneStr.substring(0, 2);
      const firstPart = phoneStr.substring(2, 7);
      const secondPart = phoneStr.substring(7, 11);
      return `(${areaCode}) ${firstPart}-${secondPart}`;
    } else {
      return phoneNumber;
    }
  }

  return (
    <div className="text-primary ">
      <div className="flex items-center gap-x-5">
        <div className="w-[80px] h-[80px]">
          <img
            className="w-full h-full"
            src={
              data.logo ||
              "https://res.cloudinary.com/dpegpgjpr/image/upload/v1709820101/n8rcav0jndwk8j3yr6sm.png"
            }
            alt=""
          />
        </div>
        <div className="w-[400px]">
          <div className="grid grid-rows">
            <h3 className="text-2xl font-bold">{data.name?.toUpperCase()}</h3>
            <p>
              <span className="text-sm font-bold">
                {data.office?.toUpperCase()}
              </span>{" "}
              <span className="font-light">CRECI {data.creci}</span>
              <div className="bg-primary w-full h-[1.2px] mt-1"></div>
            </p>
            <p className="font-light mt-1">{data.address}</p>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex ga-x-3">
            <Link to={data.whatsapp || ""} target="_blank">
              <Button variant="link" className="text-2xl" size="icon">
                <FaWhatsapp />
              </Button>
            </Link>
            <Link to={data.instagram || ""} target="_blank">
              <Button className="text-2xl" variant="link" size="icon">
                <FaInstagram />
              </Button>
            </Link>
            <Link to={data.facebook || ""} target="_blank">
              <Button className="text-2xl" variant="link" size="icon">
                <FaFacebookSquare />
              </Button>
            </Link>
            <Link to={data.linkedin || ""} target="_blank">
              <Button className="text-2xl" variant="link" size="icon">
                <FaLinkedin />
              </Button>
            </Link>
          </div>
          <div className="bg-primary w-full h-[1.2px]"></div>
          <p className="text-center">
            {formatPhoneNumber(data.telephone || "")}
          </p>
        </div>
      </div>
    </div>
  );
}
