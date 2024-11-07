import { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";
import { FormLabel, Option, Select, Table } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCases } from "@/store/caseReducer";
import CaseCard from "./CaseCard";
import DatePicker from "@/components/inputs/DatePickerInput";
import dayjs from "dayjs";
import SearchInput from "@/components/inputs/SearchInput";
import { IoGrid } from "react-icons/io5";
import { FaTableList } from "react-icons/fa6";
import { FaSortAmountDown } from "react-icons/fa";
import { FaSortAmountUp } from "react-icons/fa";
import PageStructure from "@/components/structure/PageStructure";
import CaseTableRow from "./CaseTableRow";
import Pagination from "@/components/shared/Pagination";

export default function MyCases() {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.cases.myCasesLoading);
  const data = useSelector((state: RootState) => state.cases.myCases);
  const lastPage = useSelector(
    (state: RootState) => state.cases.myCasesLastPage
  );

  const [minDate, setMinDate] = useState(() => {
    return localStorage.getItem("minDate") || dayjs().format("MM/YYYY");
  });
  const [maxDate, setMaxDate] = useState(dayjs().format("MM/YYYY"));
  const [search, setSearch] = useState(() => {
    return localStorage.getItem("search") || "";
  });
  const [type, setType] = useState(() => {
    return localStorage.getItem("type") || "financingPlanning";
  });
  const [sortDirection, setSortDirection] = useState(() => {
    return (localStorage.getItem("sortDirection") as "asc" | "desc") || "asc";
  });
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(localStorage.getItem("currentPage")) || 1;
  });
  const [orderBy, setOrderBy] = useState(() => {
    return localStorage.getItem("orderBy") || "name";
  });
  const [limit, setLimit] = useState(() => {
    return Number(localStorage.getItem("limit")) || 10;
  });
  const [showMode, setShowMode] = useState<"table" | "cards">(() => {
    return (localStorage.getItem("showMode") as "table" | "cards") || "cards";
  });

  useEffect(() => {
    const queryParams = {
      minDate,
      maxDate,
      search,
      sortDirection,
      currentPage,
      orderBy,
      limit,
      type,
    };

    dispatch(fetchCases(queryParams));
  }, [
    dispatch,
    minDate,
    maxDate,
    search,
    sortDirection,
    currentPage,
    orderBy,
    limit,
    type,
  ]);

  useEffect(() => {
    localStorage.setItem("minDate", minDate);
    localStorage.setItem("search", search);
    localStorage.setItem("type", type);
    localStorage.setItem("sortDirection", sortDirection);
    localStorage.setItem("currentPage", currentPage.toString());
    localStorage.setItem("orderBy", orderBy);
    localStorage.setItem("limit", limit.toString());
    localStorage.setItem("showMode", showMode);
  }, [
    minDate,
    search,
    type,
    sortDirection,
    currentPage,
    orderBy,
    limit,
    showMode,
  ]);

  const header = (
    <div className="flex justify-between">
      <div className="flex ms-4 items-center text-primary gap-2  text-2xl mt-5">
        <FaBook className="text-xl" />
        <h2 className="font-bold">Meus estudos</h2>
      </div>
      <div className="flex gap-5 items-end">
        <div className="flex flex-col gap-2 me-4">
          <FormLabel htmlFor="case-type-select">Tipo de estudo:</FormLabel>
          <Select
            onChange={(_, v) => setType(v || "financingPlanning")}
            id="case-type-select"
            className="w-[300px]"
            defaultValue={type}
          >
            <Option value={"financingPlanning"}>
              Planejamento de Financiamento
            </Option>
            <Option value={"financingOrCash"}>
              Financiamento vs. Compra à Vista
            </Option>
          </Select>
        </div>
        <DatePicker
          label="De:"
          onChange={(v) => setMinDate(v)}
          defaultValue={minDate}
        />
        <DatePicker
          label="Até:"
          onChange={(v) => setMaxDate(v)}
          defaultValue={maxDate}
        />
      </div>
    </div>
  );

  const contentHeader = (
    <div className={"flex justify-between"}>
      <SearchInput
        placeholder="Pesquisar"
        className="w-[300px]"
        debounceTimeout={500}
        handleDebounce={(v) => setSearch(v)}
      />
      <div className="flex items-center text-gray text-md gap-3">
        <div className="flex gap-2 me-4">
          <FormLabel className="!text-[0.8rem]">Ordenar por:</FormLabel>
          <Select
            onChange={(_, v) => setOrderBy(v || "")}
            className="w-[100px]"
            size="sm"
            defaultValue={orderBy}
          >
            <Option value={"name"}>Nome</Option>
            <Option value={"createdAt"}>Data</Option>
          </Select>
        </div>
        <span className="cursor-pointer me-4">
          {sortDirection === "asc" ? (
            <FaSortAmountUp onClick={() => setSortDirection("desc")} />
          ) : (
            <FaSortAmountDown onClick={() => setSortDirection("asc")} />
          )}
        </span>
        <IoGrid
          onClick={() => setShowMode("cards")}
          className=" cursor-pointer"
        />
        <FaTableList
          onClick={() => setShowMode("table")}
          className=" cursor-pointer"
        />
      </div>
    </div>
  );

  const content = (
    <>
      {showMode === "cards" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 uw:grid-cols-8 gap-6 p-2 pe-4">
          {data.map((caseStudy) => (
            <CaseCard key={caseStudy.name} caseStudy={caseStudy} />
          ))}
        </div>
      ) : (
        <div className="p-2 pe-4">
          <Table color="neutral" variant="plain">
            <thead>
              <tr>
                <th className="w-[80px]"></th>
                <th>Nome</th>
                <th>Nome do imóvel</th>
                <th>Descrição</th>
                <th>Tags</th>
                <th>Criado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((caseStudy) => (
                <CaseTableRow key={caseStudy.name} caseStudy={caseStudy} />
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {!loading && data.length === 0 && (
        <div className="w-full text-center">
          <span className=" text-gray">nenhum estudo encontrado</span>
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
    <PageStructure
      content={content}
      loading={loading}
      contentHeader={contentHeader}
      header={header}
      footer={footer}
    />
  );
}
