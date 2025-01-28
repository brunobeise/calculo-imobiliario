import { Typography, Divider, Button } from "@mui/joy";
import { Building } from "@/types/buildingTypes";
import { FaMapMarkerAlt, FaBed, FaBath } from "react-icons/fa";
import { BiSolidCarGarage } from "react-icons/bi";
import { SlSizeFullscreen } from "react-icons/sl";
import { GiHammerNails } from "react-icons/gi";
import { navigate } from "vike/client/router";
import { FaHouse } from "react-icons/fa6";
import { MdApartment } from "react-icons/md";
import { HiBuildingStorefront } from "react-icons/hi2";
import { MdTerrain } from "react-icons/md";

const BuildingCard = ({
  building,
  onLink,
}: {
  building: Building;
  onLink?: (data: Building) => void;
}) => {
  const icon = () => {
    if (building.category === "HOUSE")
      return (
        <>
          <FaHouse />
          <span>Casa</span>
        </>
      );

    if (building.category === "APARTMENT")
      return (
        <>
          <MdApartment />
          <span>Apto.</span>
        </>
      );

    if (building.category === "COMMERCIAL")
      return (
        <>
          <HiBuildingStorefront />
          <span>Comercial</span>
        </>
      );

    if (building.category === "LAND")
      return (
        <>
          <MdTerrain />
          <span>Terreno</span>
        </>
      );
  };

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
        <div className="text-sm text-grayText h-[40px]">
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

      <div className="flex items-center justify-center text-[0.8rem] gap-5">
        <div className=" p-1 bg-white font-bold !text-grayText rounded-lg text-md flex items-center gap-2">
          {icon()}
        </div>
        <div className="flex items-center gap-2 text-grayText">
          <GiHammerNails />
          <span className="font-bold !text-grayText">
            {building.builtArea}m²
          </span>
        </div>
        <div className="flex items-center gap-2 text-grayText">
          <SlSizeFullscreen />
          <span className="font-bold !text-grayText">
            {building.landArea}m²
          </span>
        </div>
      </div>

      {onLink && (
        <Button onClick={() => onLink(building)} className="!absolute bottom-4 w-[220px] left-[50%] translate-x-[-50%]">
          Vincular
        </Button>
      )}
    </div>
  );
};

export default BuildingCard;
