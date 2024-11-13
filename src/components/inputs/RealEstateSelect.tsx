import { FormLabel, Option, Select } from "@mui/joy";
import { Spinner } from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { fetchRealEstateSelectOptions } from "@/store/realEstateReducer";

interface RealEstateSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RealEstateSelect(props: RealEstateSelectProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { realEstateSelectOptions, realEstateSelectOptionsLoading } =
    useSelector((state: RootState) => state.realEstate);
  useEffect(() => {
    if (realEstateSelectOptions.length === 0) {
      dispatch(fetchRealEstateSelectOptions());
    }
  }, [dispatch, realEstateSelectOptions.length]);

  return (
    <div className="w-[250px]">
      <FormLabel htmlFor={"realEstate__select"}>
        {"Ver como imobiliária:"}
      </FormLabel>
      <Select
        color="neutral"
        id="realEstate__select"
        onChange={(_, v) => props.onChange(v as string)}
      >
        <Option className="!bg-whitefull hover:!bg-grayScale-100" value={""}>
          <div className="flex items-center">
            <div className="ms-2 flex flex-col">
              <span className="text-md text-blackish">Todas</span>
            </div>
          </div>
        </Option>
        {!realEstateSelectOptionsLoading ? (
          <>
            {realEstateSelectOptions.map((realEstate) => (
              <Option
                className="!bg-whitefull hover:!bg-grayScale-100"
                key={realEstate.id}
                value={realEstate.id}
              >
                <div className="w-full p-2 flex flex-col justify-center cursor-pointer bg-transparent">
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden flex justify-center items-center w-[30px] h-[30px]">
                      <img
                        src={
                          realEstate?.logo ||
                          "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
                        }
                      />
                    </div>
                    <div className="ms-2 flex flex-col">
                      <span className="text-md text-blackish">
                        {realEstate?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </Option>
            ))}
          </>
        ) : (
          <Spinner />
        )}
      </Select>
    </div>
  );
}
