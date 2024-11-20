import { RootState } from "@/store/store";
import { User } from "@/types/userTypes";
import { Typography } from "@mui/joy";
import { useSelector } from "react-redux";

interface UserSignatureProps {
  userData?: User;
  title?: string;
  desc?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

export default function UserSignature3(props: UserSignatureProps) {
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
        className=" bg-primary p-10 w-full"
      >
        <div className="flex items-center justify-between">
          <div>
            <Typography
              fontStyle={{ color: props.primaryColor }}
              level="h3"
              className=" mb-4"
            >
              {props.title || "Plano de Aquisição"}
            </Typography>
            <p className="text-md font-light">
              por <strong>{data.fullName}</strong> CRECI {data.creci}
            </p>
          </div>

          <div>
            <img
              className="max-h-[60px] max-w-[120px]"
              src={
                data.realEstate?.logo ||
                "https://res.cloudinary.com/dpegpgjpr/image/upload/v1722019585/s71bo47g6jxzo88gh5x1.png"
              }
              alt="Logo da Imobiliária"
            />
          </div>
        </div>
      </div>
      <div
        style={{ backgroundColor: props.primaryColor }}
        className="h-[20px] w-full"
      ></div>
    </div>
  );
}
