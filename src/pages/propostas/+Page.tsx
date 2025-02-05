/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
  FaBook,
  FaCaretDown,
  FaCaretUp,
  FaFileAlt,
  FaPlusCircle,
} from "react-icons/fa";
import { Button, FormLabel, Option, Select, Table } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAdminCases,
  fetchCases,
  fetchRealEstateCases,
} from "@/store/caseReducer";
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
import ContextSelectorButton from "@/components/shared/ContextSelectorButton";
import { FaShareAltSquare } from "react-icons/fa";
import CoWorkerSelect from "@/components/inputs/CoWorkerSelect";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";
import { RiAdminFill } from "react-icons/ri";
import StatusFilter from "@/components/shared/StatusFilter";
import { useMenu } from "@/components/menu/MenuContext";

export default function MyCases() {
  const dispatch = useDispatch<AppDispatch>();
  const { toggleMenu, toggleBackdrop } = useMenu();

  const [casesContext, setCasesContext] = useState<
    "myCases" | "realEstateCases" | "adminCases"
  >("myCases");
  const [casesContextDropdown, setCasesContextDropdown] = useState(false);
  const lastPage = useSelector(
    (state: RootState) =>
      state.proposals[
        casesContext === "myCases"
          ? "myCasesLastPage"
          : casesContext === "adminCases"
          ? "adminCasesLastPage"
          : "realEstateCasesLastPage"
      ]
  );

  const loading = useSelector(
    (state: RootState) =>
      state.proposals[
        casesContext === "myCases"
          ? "myCasesLoading"
          : casesContext === "adminCases"
          ? "adminCasesLoading"
          : "realEstateCasesLoading"
      ]
  );
  const data = useSelector((state: RootState) => state.proposals[casesContext]);

  const [minDate, setMinDate] = useState(() => {
    const storedMinDate = localStorage.getItem("minDate");
    return storedMinDate || dayjs().subtract(1, "year").format("MM/YYYY");
  });

  const [maxDate, setMaxDate] = useState(dayjs().format("MM/YYYY"));

  const [statuses, setStatuses] = useState<string[]>(() => {
    const storedStatuses = localStorage.getItem("statuses");
    return storedStatuses
      ? (JSON.parse(storedStatuses) as string[])
      : ["Enviada", "Aceita", "Rascunho", "Recusada", "Em Análise"];
  });

  const [search, setSearch] = useState("");

  const [type, setType] = useState(() => {
    return localStorage.getItem("type") || "";
  });

  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(() => {
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

  const [filterByUser, setFilterByUser] = useState("");

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
      userId: filterByUser,
      statuses,
    };
    if (casesContext === "myCases") dispatch(fetchCases(queryParams));
    if (casesContext === "adminCases") dispatch(fetchAdminCases(queryParams));
    if (casesContext === "realEstateCases")
      dispatch(fetchRealEstateCases(queryParams));
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
    casesContext,
    filterByUser,
    statuses,
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
    localStorage.setItem("statuses", JSON.stringify(statuses));
  }, [
    minDate,
    search,
    type,
    sortDirection,
    currentPage,
    orderBy,
    limit,
    showMode,
    statuses,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [casesContext]);

  const CasesContextSelect = () => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setCasesContextDropdown(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        ref={dropdownRef}
        className="bg-white absolute top-14 shadow-lg w-max z-[2]"
      >
        <ContextSelectorButton
          onClick={() => {
            setCasesContext("myCases");
            setCasesContextDropdown(false);
          }}
          title={
            <div className="flex items-center text-primary gap-2">
              <FaBook className="text-sm" />
              <h3 className="font-bold !text-sm">Minhas Propostas</h3>
            </div>
          }
        />
        <ContextSelectorButton
          onClick={() => {
            setCasesContext("realEstateCases");
            setCasesContextDropdown(false);
          }}
          title={
            <div className="flex items-center text-primary gap-2">
              <FaShareAltSquare className="text-sm" />
              <h3 className="font-bold !text-sm">Compartilhadas</h3>
            </div>
          }
        />
        {user.admin && (
          <ContextSelectorButton
            onClick={() => {
              setCasesContext("adminCases");
              setCasesContextDropdown(false);
            }}
            title={
              <div className="flex items-center text-primary gap-2">
                <RiAdminFill className="text-sm" />
                <h3 className="font-bold !text-sm">Admin</h3>
              </div>
            }
          />
        )}
      </div>
    );
  };

  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    navigate("/");
    return null;
  }

  const header = (
    <div className="flex justify-between ">
      <div className="flex ms-4 items-center text-primary gap-2  text-xl mt-5 relative">
        {casesContext === "myCases" && <FaFileAlt className="text-xl" />}
        {casesContext === "realEstateCases" && (
          <FaShareAltSquare className="text-md" />
        )}
        {casesContext === "adminCases" && <RiAdminFill className="text-md" />}
        <h2 className="font-bold text-nowrap">
          {casesContext === "myCases" && "Minhas Propostas"}{" "}
          {casesContext === "realEstateCases" && "Compartilhadas"}
          {casesContext === "adminCases" && "Admin"}
        </h2>
        {!casesContextDropdown ? (
          <FaCaretDown
            onClick={() => setCasesContextDropdown(true)}
            className="cursor-pointer text-[1.2rem]"
          />
        ) : (
          <FaCaretUp
            onClick={() => setCasesContextDropdown(false)}
            className="cursor-pointer text-[1.2rem]"
          />
        )}

        {casesContextDropdown && <CasesContextSelect />}
      </div>
      <div className="flex gap-5 items-end">
        <div className="flex flex-col gap-2">
          <FormLabel htmlFor="case-type-select">Tipo de proposta:</FormLabel>
          <Select
            onChange={(_, v) => setType(v || "")}
            id="case-type-select"
            className="w-[300px]"
            defaultValue={type}
          >
            <Option value={""}>Todos</Option>
            <Option value={"financingPlanning"}>
              Planejamento de Financiamento
            </Option>
            <Option value={"directFinancing"}>Parcelamento Direto</Option>
          </Select>
        </div>
        {casesContext !== "realEstateCases" && (
          <>
            <DatePicker
              width="180px"
              label="De:"
              onChange={(v) => setMinDate(v)}
              defaultValue={minDate}
            />
            <DatePicker
              width="180px"
              label="Até:"
              onChange={(v) => setMaxDate(v)}
              defaultValue={maxDate}
            />
          </>
        )}
        <Button
          onClick={() => {
            navigate("/cenarios");
            toggleMenu(false);
            toggleBackdrop(false);
          }}
          endDecorator={<FaPlusCircle />}
        >
          Nova Proposta
        </Button>
      </div>
    </div>
  );

  const contentHeader = (
    <div className={"flex justify-between"}>
      <div className="flex gap-5 items-end">
        <SearchInput
          placeholder="Pesquisar"
          className="w-[300px]"
          debounceTimeout={500}
          handleDebounce={(v) => setSearch(v)}
        />
        {casesContext === "realEstateCases" && (
          <div className="w-[300px]">
            <CoWorkerSelect
              placeholder="Filtrar por colega"
              value={filterByUser}
              onChange={(v) => setFilterByUser(v)}
            />
          </div>
        )}
      </div>

      <div>
        <StatusFilter value={statuses} onChange={(v) => setStatuses(v)} />
      </div>

      <div className="flex items-center text-gray text-md gap-3">
        {casesContext !== "realEstateCases" && (
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
        )}

        {casesContext !== "realEstateCases" && (
          <span className="cursor-pointer me-4">
            {sortDirection === "asc" ? (
              <FaSortAmountUp onClick={() => setSortDirection("desc")} />
            ) : (
              <FaSortAmountDown onClick={() => setSortDirection("asc")} />
            )}
          </span>
        )}

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
        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 uw:grid-cols-8 gap-6 p-2 pe-4">
          {data.map((caseStudy) => (
            <CaseCard
              adminCase={casesContext === "adminCases"}
              realEstateCase={casesContext === "realEstateCases"}
              key={caseStudy.name}
              caseStudy={caseStudy}
            />
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
      {loading && data.length === 0 && (
        <div className="w-full text-center">
          <span className=" text-gray mt-4">nenhuma proposta encontrada</span>
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
