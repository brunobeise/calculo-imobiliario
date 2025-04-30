import { Divider } from "@mui/joy";
import { useState, useEffect } from "react";
import {
  FaBuilding,
  FaPen,
  FaSortAmountDown,
  FaSortAmountUp,
  FaSync,
} from "react-icons/fa";
import { FormLabel, Option, Select } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBuildings } from "@/store/buildingReducer";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/inputs/SearchInput";
import BuildingCard from "@/pages/imoveis/BuildingCard";
import { BuildingCategorySelect } from "../inputs/BuildingCategorySelect";
import { PageLoading } from "../Loading";
import { Building } from "@/types/buildingTypes";
import { FaTrash } from "react-icons/fa6";
import { buildingService } from "@/service/buildingService";
import Dialog from "../modals/Dialog";

interface LinkBuildingButtonProps {
  onLink: (data: Building) => void;
  onUnlink: () => void;
  buildingId?: string;
  buildingPhoto?: string;
  buildingName?: string;
}

export default function LinkBuildingButton({
  onLink,
  onUnlink,
  buildingId,
  buildingPhoto,
  buildingName,
}: LinkBuildingButtonProps) {
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const buildings = useSelector((state: RootState) => state.building.buildings);
  const loading = useSelector((state: RootState) => state.building.loading);
  const lastPage = useSelector((state: RootState) => state.building.lastPage);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [orderBy, setOrderBy] = useState(
    localStorage.getItem("building-orderBy") || "propertyName"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (localStorage.getItem("building-sortDirection") as "asc" | "desc") || "desc"
  );
  const [currentPage, setCurrentPage] = useState(1);

  const [syncLoading, setSyncLoading] = useState(false);

  const handleLink = async (id: string) => {
    setOpen(false);
    const data = await buildingService.getBuildingById(id);
    onLink(data);
  };

  useEffect(() => {
    if (open) {
      const queryParams = {
        search,
        category,
        sortDirection,
        currentPage,
        orderBy,
        limit: 5,
      };
      dispatch(fetchBuildings(queryParams));
    }
  }, [dispatch, search, category, sortDirection, currentPage, orderBy, open]);

  const contentHeader = (
    <div className="flex justify-between items-center w-full pe-10">
      <div className="text-[1rem] flex items-center">
        <FaBuilding className="me-1" /> Vincular imóvel
      </div>
      <div className="flex items-center gap-3 text-grayText">
        <SearchInput
          placeholder="Pesquisar"
          className="w-[200px]"
          debounceTimeout={500}
          handleDebounce={(v) => setSearch(v)}
        />
        <BuildingCategorySelect onChange={(v) => setCategory(v)} />
        <div className="flex gap-2">
          <FormLabel className="!text-[0.8rem]">Ordenar por:</FormLabel>
          <Select
            onChange={(_, v) => setOrderBy(v || "")}
            className="w-[150px]"
            size="sm"
            defaultValue={orderBy}
          >
            <Option value="propertyName">Nome</Option>
            <Option value="createdAt">Data</Option>
          </Select>
        </div>
        <span className="cursor-pointer">
          {sortDirection === "asc" ? (
            <FaSortAmountUp onClick={() => setSortDirection("desc")} />
          ) : (
            <FaSortAmountDown onClick={() => setSortDirection("asc")} />
          )}
        </span>
      </div>
    </div>
  );

  const content = (
    <div className="grid grid-cols-5 gap-6 p-2 pe-4 relative h-[400px]">
      {buildings.map((building) => (
        <BuildingCard
          onLink={(data) => {
            setOpen(false);
            handleLink(data);
          }}
          key={building.id}
          building={building}
        />
      ))}

      {loading && (
        <div className="absolute flex items-center justify-center bg-white/80 z-10 w-full h-full ">
          <PageLoading />
        </div>
      )}

      {!loading && buildings.length === 0 && (
        <div className="w-full text-center">
          <span className="text-gray mt-4">Nenhum imóvel encontrado</span>
        </div>
      )}
    </div>
  );

  const footer = (
    <Pagination
      currentPage={currentPage}
      onPageChange={(p) => setCurrentPage(p)}
      totalPages={lastPage || 0}
    />
  );

  const handleSync = async () => {
    setSyncLoading(true);
    const buildingData = await buildingService.getBuildingById(buildingId);

    onLink(buildingData);
    setSyncLoading(false);
  };

  return (
    <>
      <div
        onClick={() => !buildingId && setOpen(true)}
        className={`relative flex items-center border-solid border border-border text-grayText rounded-lg relative h-32 overflow-hidden mb-2 ${
          buildingId
            ? "flex-row"
            : "justify-center cursor-pointer hover:border-grayScale-300"
        }`}
      >
        {buildingId ? (
          <>
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <img
                src={buildingPhoto}
                alt="Foto do imóvel"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-black opacity-[0.45] pointer-events-none" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-5 text-white">
                <span className="text-lg font-medium text-white drop-shadow-lg">
                  {buildingName}
                </span>

                <div className="flex gap-5">
                  <FaSync
                    onClick={handleSync}
                    className={`cursor-pointer hover:opacity-70 drop-shadow-lg ${
                      syncLoading ? "animate-spin" : ""
                    }`}
                  />
                  <FaPen
                    onClick={() => setOpen(true)}
                    className="cursor-pointer hover:opacity-70 drop-shadow-lg"
                  />
                  <FaTrash
                    onClick={() => onUnlink()}
                    className="cursor-pointer hover:opacity-70 drop-shadow-lg"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <FaBuilding className="me-1" />
            Vincular imóvel
          </>
        )}
      </div>

      <Dialog title={contentHeader} open={open} onClose={() => setOpen(false)}>
        <Divider />

        <div className="w-[1220px] py-5">{content}</div>
        {footer}
      </Dialog>
    </>
  );
}
