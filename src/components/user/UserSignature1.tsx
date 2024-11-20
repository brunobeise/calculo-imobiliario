import { RootState } from "@/store/store";
import { User } from "@/types/userTypes";
import { useSelector } from "react-redux";
import UserPicture from "../shared/UserPicture";

interface UserSignatureProps {
  userData?: User;
  title?: string;
  desc?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

export default function UserSignature1(props: UserSignatureProps) {
  const userReducer = useSelector((state: RootState) => state.user.userData);
  const realEstateReducer = useSelector(
    (state: RootState) => state.realEstate.realEstateData
  );

  const data = props.userData ?? {
    ...userReducer,
    realEstate: realEstateReducer,
  };

  return (
    <div className="flex flex-col w-full">
      <div
        style={{
          color: props.primaryColor,
          backgroundColor: props.backgroundColor,
        }}
        className="p-5 w-full "
      >
        <div className="flex items-center h-[110px] px-2 justify-between">
          <div className="flex items-center gap-2">
            <img
              className="max-h-[60px] max-w-[100px]"
              src={
                data.realEstate?.logo ||
                "https://res.cloudinary.com/dpegpgjpr/image/upload/v1722019585/s71bo47g6jxzo88gh5x1.png"
              }
              alt=""
            />
            <div className="ms-5">
              <h3 className="text-2xl mb-1 text-nowrap">
                <strong>{props.title || "Plano de Aquisição"} </strong>
              </h3>
              <p className="text-md">
                {props.desc || "Casa de Alvenaria no Bell Ville"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-end">
              <strong>{data.fullName?.toUpperCase()} </strong>{" "}
              <p className="ms-2 font-light">CRECI {data.creci}</p>
            </div>
            <UserPicture
              border={props.backgroundColor}
              size={60}
              src={data.photo}
            />
          </div>
        </div>
      </div>
      <div
        style={{ backgroundColor: props.primaryColor }}
        className="h-[20px] w-full"
      />
    </div>
  );
}
