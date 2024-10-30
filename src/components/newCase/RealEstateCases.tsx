import { PropertyData } from "@/propertyData/PropertyDataContext";
import { CaseStudy } from "@/types/caseTypes";
import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { FaFile, FaSearch } from "react-icons/fa";
import { BsFillHouseFill } from "react-icons/bs";
import dayjs from "dayjs";
import { Spinner } from "../Loading";
import SearchInput from "../inputs/SearchInput";

interface RealEstateCasesProps {
  realEstateCases: CaseStudy[];
  loading: boolean;
  setMultiplePropertyData: (data: PropertyData) => void;
  setNewCase: (v: boolean) => void;
}

export default function RealEstateCases({
  realEstateCases,
  loading,
  setMultiplePropertyData,
  setNewCase,
}: RealEstateCasesProps) {
  return (
    <div className="flex gap-10">
      <Card className="w-[500px]  h-[460px] shadow-lg overflow-y-auto">
        {realEstateCases.length > 0 ? (
          <>
            {realEstateCases.map((c) => (
              <ContextSelectorButton
                key={c.id}
                icon={<FaFile />}
                onClick={() => {
                  setMultiplePropertyData(c.propertyData);
                  setNewCase(false);
                }}
                title={c.name}
                extra={
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden flex justify-center items-center w-[30px] h-[30px]">
                      <img
                        src={
                          c.user?.photo ||
                          "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
                        }
                      />
                    </div>
                    <div className="ms-2 flex flex-col">
                      <span className="text-md text-blackish">
                        {c.user?.fullName}
                      </span>
                      <span className="text-md text-grayText">
                        {dayjs(c.createdAt).format("DD/MM/YYYY")}
                      </span>
                    </div>
                  </div>
                }
                desc={
                  <div>
                    {c.propertyName && (
                      <span className="flex gap-1 items-center">
                        <BsFillHouseFill />
                        {c.propertyName}
                      </span>
                    )}
                  </div>
                }
              />
            ))}
          </>
        ) : !loading ? (
          <p className="text-center font-bold mt-5 px-12">
            Não há nenhum estudo compartilhado pelos seus colegas :(
          </p>
        ) : (
          <Spinner />
        )}
      </Card>
      <div className="w-[300px]">
        <SearchInput
          placeholder="Pesquisar"
          debounceTimeout={1000}
          className="w-full"
          handleDebounce={(e) => console.log(e)}
          endDecorator={<FaSearch className="text-gray" />}
        />
      </div>
    </div>
  );
}
