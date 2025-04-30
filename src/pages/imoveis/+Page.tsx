/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import {
  FaBuilding,
  FaPlusCircle,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { Button, FormLabel, Option, Select } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchBuildings } from "@/store/buildingReducer";
import Pagination from "@/components/shared/Pagination";
import SearchInput from "@/components/inputs/SearchInput";
import PageStructure from "@/components/structure/PageStructure";
import { navigate } from "vike/client/router";
import BuildingCard from "./BuildingCard";
import ImobziModal from "@/components/modals/ImobziModal";
import { useAuth } from "@/auth";
import CurrencyInput from "@/components/inputs/CurrencyInput";
import debounce from "lodash.debounce";

export default function Buildings() {
  const dispatch = useDispatch<AppDispatch>();

  const buildings = useSelector((state: RootState) => state.building.buildings);
  const lastPage = useSelector((state: RootState) => state.building.lastPage);
  const loading = useSelector((state: RootState) => state.building.loading);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [orderBy, setOrderBy] = useState(
    localStorage.getItem("building-orderBy") || "propertyName"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    (localStorage.getItem("building-sortDirection") as "asc" | "desc") || "desc"
  );
  const [imobziModal, setImobziModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [minPriceInput, setMinPriceInput] = useState<number>();
  const [maxPriceInput, setMaxPriceInput] = useState<number>();
  const [minPrice, setMinPrice] = useState<number>();
  const [maxPrice, setMaxPrice] = useState<number>();

  const debounceSetPrices = useMemo(
    () =>
      debounce((min: number | undefined, max: number | undefined) => {
        setMinPrice(min && min > 0 ? min : undefined);
        setMaxPrice(max && max > 0 ? max : undefined);
        setCurrentPage(1);
      }, 500),
    []
  );

  useEffect(() => {
    debounceSetPrices(minPriceInput, maxPriceInput);
  }, [minPriceInput, maxPriceInput, debounceSetPrices]);

  const [limit, setLimit] = useState(10);
  useEffect(() => {
    const queryParams = {
      minPrice,
      maxPrice,
      search,
      category,
      sortDirection,
      currentPage,
      orderBy,
      limit,
    };
    dispatch(fetchBuildings(queryParams));
  }, [
    dispatch,
    search,
    category,
    sortDirection,
    currentPage,
    orderBy,
    limit,
    minPrice,
    maxPrice,
  ]);

  useEffect(() => {
    localStorage.setItem("building-orderBy", orderBy);
  }, [orderBy]);

  useEffect(() => {
    localStorage.setItem("building-sortDirection", sortDirection);
  }, [sortDirection]);

  const { user } = useAuth();

  const header = (
    <div className="flex items-center justify-between">
      <div className="flex items-center text-primary gap-2 text-2xl ms-4 mt-8 mb-3 w-[250px]">
        <FaBuilding className="text-xl" />
        <h2 className="font-bold">Imóveis</h2>
      </div>

      <div className="flex gap-5 items-end">
        <div className="flex flex-col gap-2">
          <FormLabel htmlFor="building-category-select">Categoria:</FormLabel>
          <Select
            onChange={(_, v) => setCategory(v || "")}
            id="building-category-select"
            className="w-[300px]"
            defaultValue={category}
          >
            <Option value="">Todos</Option>
            <Option value="HOUSE">Casa</Option>
            <Option value="APARTMENT">Apartamento</Option>
            <Option value="COMMERCIAL">Comercial</Option>
            <Option value="LAND">Terreno</Option>
          </Select>
        </div>

        <div className="flex gap-4 items-end">
          {user.imobzi && (
            <Button
              className="!mt-4"
              variant="outlined"
              onClick={() => setImobziModal(true)}
              endDecorator={
                <img
                  className="w-7"
                  src="https://play-lh.googleusercontent.com/D99YQI9BnlZXfwHApFEZVX50OaJYZ1UadsvxUA2itNoyjsQpGCdoZ61wGGz3rjspRvzU=w240-h480-rw"
                />
              }
            >
              Sincronizar com Imobzi
            </Button>
          )}
          <Button
            onClick={() => navigate("/imoveis/novo")}
            endDecorator={<FaPlusCircle />}
          >
            Novo Imóvel
          </Button>
        </div>
      </div>
    </div>
  );

  const contentHeader = (
    <div className="flex justify-between items-center">
      <SearchInput
        placeholder="Pesquisar"
        className="w-[300px]"
        debounceTimeout={500}
        handleDebounce={(v) => setSearch(v)}
      />
      <div className="flex items-center gap-3">
        <div className="flex gap-3">
          <FormLabel className="!text-[0.8rem]">Filtrar por preço:</FormLabel>
          <CurrencyInput
            noHeight
            onChange={(v) => setMinPriceInput(Number(v.target.value))}
            placeholder="Preço mínimo"
            value={minPriceInput}
          />
          <CurrencyInput
            noHeight
            onChange={(v) => setMaxPriceInput(Number(v.target.value))}
            placeholder="Preço máximo"
            value={maxPriceInput}
          />
        </div>

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
            <Option value="value">Preço</Option>
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
    <>
      <div className="grid grid-cols-2 lg:grid-cols-5 uw:grid-cols-8 gap-6 p-2 pe-4">
        {buildings.map((building) => (
          <BuildingCard building={building} />
        ))}
      </div>

      {loading && buildings.length === 0 && (
        <div className="w-full text-center">
          <span className="text-gray mt-4">Nenhum imóvel encontrado</span>
        </div>
      )}
    </>
  );

  const footer = (
    <Pagination
      currentPage={currentPage}
      onPageChange={(p) => setCurrentPage(p)}
      totalPages={lastPage || 0}
      onLimitChange={(v) => setLimit(v)}
      limit={limit}
    />
  );

  return (
    <>
      <PageStructure
        content={content}
        loading={loading}
        contentHeader={contentHeader}
        header={header}
        footer={footer}
      />
      <ImobziModal open={imobziModal} onClose={() => setImobziModal(false)} />
    </>
  );
}
