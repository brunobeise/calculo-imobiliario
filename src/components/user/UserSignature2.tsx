import { formatPhone } from "@/lib/formatter";
import { RootState } from "@/store/store";
import { User } from "@/types/userTypes";
import { useSelector } from "react-redux";

interface UserSignatureProps {
  userData?: User;
  title?: string;
  desc?: string;
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
}

export default function UserSignature2(props: UserSignatureProps) {
  const userReducer = useSelector((state: RootState) => state.user.userData);
  const realEstateReducer = useSelector(
    (state: RootState) => state.realEstate.realEstateData
  );

  const data = props.userData ?? {
    ...userReducer,
    realEstate: realEstateReducer,
  };

  return (
    <div
      style={{
        backgroundColor: props.primaryColor,
        color: props.backgroundColor,
      }}
      className="p-5 w-full flex justify-center pe-10"
    >
      <div className="flex items-center h-[110px]">
        <div className="w-[90px] h-[90px]">
          <img
            style={{
              backgroundColor: props.primaryColor,
            }}
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center translate-x-[15px]"
            src={data.realEstate?.logo2}
            alt=""
          />
        </div>
        <div
          style={{
            borderColor: props.backgroundColor,
          }}
          className="w-[90px] h-[90px] rounded-full overflow-hidden flex items-center justify-center border-2"
        >
          <img
            className="w-full h-full object-cover object-center"
            src={data.photo}
            alt=""
          />
        </div>

        <div className="ms-5">
          <div className="grid grid-rows">
            <h3
              style={{
                color: props.backgroundColor,
              }}
              className="text-2xl mb-1"
            >
              <strong>{props.title || "Plano de Aquisição"} </strong>
            </h3>
            <p className="text-lg">
              {props.desc || "Casa de Alvenaria no Bell Ville"}
            </p>
            <div
              style={{
                backgroundColor: props.backgroundColor,
              }}
              className="bg-white w-full h-[1.2px] my-2"
            ></div>
            <span className="text-sm">
              <strong>{data.fullName?.toUpperCase()} </strong>{" "}
              <span className="ms-2 font-light">CRECI {data.creci}</span>
              <span className="ms-2">
                {data.whatsapp ? (
                  <a
                    href={data.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formatPhone(data.phone)}
                  </a>
                ) : (
                  formatPhone(data.phone)
                )}
              </span>
            </span>{" "}
          </div>
        </div>
      </div>
    </div>
  );
}
