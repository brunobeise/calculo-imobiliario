import { Typography, Divider, Button } from "@mui/joy";
import { Building } from "@/types/buildingTypes";
import { FaMapMarkerAlt, FaBed, FaBath } from "react-icons/fa";
import { BiSolidCarGarage } from "react-icons/bi";
import { navigate } from "vike/client/router";
import { toBRL } from "@/lib/formatter";

const BuildingCard = ({
  building,
  onLink,
}: {
  building: Building;
  onLink?: (id: string) => void;
  linkLoading?: boolean;
}) => {
  return (
    <div
      onClick={() => {
        !onLink && navigate(`/imoveis/${building.id}`);
      }}
      className={`relative overflow-hidden min-h-[260px] rounded-[12px] shadow-md duration-300 px-5 pt-[150px] pb-2 flex flex-col 
                  bg-white ${!onLink ? "cursor-pointer hover:shadow-xl" : ""} `}
    >
      <div className="absolute w-full top-0 left-0">
        <div className="h-[150px] overflow-hidden flex justify-center items-top relative w-full">
          <img className="w-full" src={building?.mainPhoto} />
          <div className="absolute bottom-0 h-[50px] w-full bg-gradient-to-t from-[#000000de] to-transparent flex items-center px-10 text-lg font-light" />
        </div>
      </div>

      <div className="mt-4 mb-2">
        <Typography
          className="!mb-1 text-gray-800 !text-lg truncate overflow-hidden line-clamp-1"
          level="h4"
        >
          {building?.propertyName}
        </Typography>
        <Typography level="title-md" className="h-[20px]">
          {Number(building.value) > 0 && toBRL(building.value)}
        </Typography>
        <div className="text-sm text-grayText h-[40px] mt-2">
          <div className="flex items-center mb-2">
            <div>
              <FaMapMarkerAlt size={12} className="mr-2" />
            </div>
            <p className="text-[0.7rem] line-clamp-2">{building?.address}</p>
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-around my-2">
        <div className="flex items-center gap-2 text-grayText">
          <FaBed />{" "}
          <span className="font-bold !text-grayText">{building.bedrooms}</span>
        </div>
        <div className="flex items-center gap-2 text-grayText">
          <FaBath />{" "}
          <span className="font-bold !text-grayText">{building.bathrooms}</span>
        </div>
        <div className="flex items-center gap-2 text-grayText">
          <BiSolidCarGarage />{" "}
          <span className="font-bold !text-grayText">
            {building.parkingSpaces}
          </span>
        </div>
      </div>

      {onLink && (
        <Button
          onClick={() => onLink(building.id)}
          className="!absolute bottom-4 w-[220px] left-[50%] translate-x-[-50%]"
        >
          Vincular
        </Button>
      )}
    </div>
  );
};

export default BuildingCard;
