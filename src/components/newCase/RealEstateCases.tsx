import { PropertyData } from "@/propertyData/PropertyDataContext";
import { Proposal } from "@/types/proposalTypes";
import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { FaFile, FaSearch } from "react-icons/fa";
import { BsFillHouseFill } from "react-icons/bs";
import dayjs from "dayjs";
import { Spinner } from "../Loading";
import SearchInput from "../inputs/SearchInput";
import Pagination from "../shared/Pagination";
import { useEffect, useState } from "react";
import { fetchRealEstateCases } from "@/store/caseReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import CoWorkerSelect from "../inputs/CoWorkerSelect";

interface RealEstateCasesProps {
  realEstateCases: Proposal[];
  loading: boolean;
  setMultiplePropertyData: (data: PropertyData) => void;
  setNewCase: (v: boolean) => void;
  totalPages: number;
}

export default function RealEstateCases({
  realEstateCases,
  loading,
  setMultiplePropertyData,
  setNewCase,
  totalPages,
}: RealEstateCasesProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1);

  const [filterByUser, setFilterByUser] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(
      fetchRealEstateCases({
        currentPage: page,
        search: search,
        limit: 10,
        userId: filterByUser,
      })
    );
  }, [dispatch, filterByUser, page, search]);

  return (
    <div className="relative ">
      <div className="flex gap-5 items-end mb-2 justify-between">
        <SearchInput
          placeholder="Pesquisar"
          debounceTimeout={1000}
          className="w-full"
          handleDebounce={(e) => setSearch(e)}
          endDecorator={<FaSearch className="text-gray" />}
        />
        <div className="w-full">
          <CoWorkerSelect
            label="Filtrar por colega:"
            value={filterByUser}
            onChange={(v) => setFilterByUser(v)}
          />
        </div>
      </div>
      <Card className="shadow-lg col-span-2 w-[320px] md:w-[500px]">
        <div className="h-[380px] overflow-y-auto">
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
              {filterByUser
                ? "Não há nenhum estudo compartilhado por esse usuário"
                : "Não há nenhum estudo compartilhado pelos seus colegas"}
            </p>
          ) : (
            <Spinner />
          )}
        </div>

        <Pagination
          onPageChange={(v) => setPage(v)}
          currentPage={page}
          totalPages={totalPages}
        />
      </Card>
    </div>
  );
}
