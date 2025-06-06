/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import {
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
import CaseCard from "./ProposalCard";
import DatePicker from "@/components/inputs/DatePickerInput";
import dayjs from "dayjs";
import SearchInput from "@/components/inputs/SearchInput";
import { IoGrid } from "react-icons/io5";
import { FaTableList } from "react-icons/fa6";
import { FaSortAmountDown } from "react-icons/fa";
import { FaSortAmountUp } from "react-icons/fa";
import PageStructure from "@/components/structure/PageStructure";
import CaseTableRow from "./ProposalTableRow";
import Pagination from "@/components/shared/Pagination";
import ContextSelectorButton from "@/components/shared/ContextSelectorButton";
import { FaShareAltSquare } from "react-icons/fa";
import CoWorkerSelect from "@/components/inputs/CoWorkerSelect";
import { useAuth } from "@/auth";
import { navigate } from "vike/client/router";
import { RiAdminFill } from "react-icons/ri";
import StatusFilter from "@/components/shared/StatusFilter";
import { useMenu } from "@/components/menu/MenuContext";
import ProposalBoard from "./ProposalBoard";
import { MdViewKanban } from "react-icons/md";
import { ProposalTypes } from "@/types/proposalTypes";

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

  const [showMode, setShowMode] = useState<"table" | "cards" | "board">(() => {
    return (localStorage.getItem("showMode") as "table" | "cards") || "cards";
  });

  const [filterByUser, setFilterByUser] = useState("");

  useEffect(() => {
    const queryParams = {
      minDate,
      maxDate,
      search,
      sortDirection,
      currentPage: showMode === "board" ? 1 : currentPage,
      orderBy,
      limit: showMode === "board" ? 1000000 : limit,
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
    showMode,
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
        className="bg-white absolute top-14 shadow-lg w-[240px] z-[2]"
      >
        <ContextSelectorButton
          onClick={() => {
            setCasesContext("myCases");
            setCasesContextDropdown(false);
          }}
          title={
            <div className="flex items-center text-primary gap-2">
              <FaFileAlt className="text-sm" />
              <h3 className="font-bold !text-sm">Minhas Propostas</h3>
            </div>
          }
        />

        <ContextSelectorButton
          onClick={() => {
            setCasesContext("realEstateCases");
            setCasesContextDropdown(false);
            if (showMode === "board") setShowMode("cards");
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
              if (showMode === "board") setShowMode("cards");
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
    <div className="flex justify-between flex-wrap">
      <div
        onClick={() =>
          !user.isAutonomous && setCasesContextDropdown(!casesContextDropdown)
        }
        className={`${user.isAutonomous ? '' : 'cursor-pointer'} flex ms-4 items-center text-primary gap-2  text-xl mt-5 relative`}
      >
        {casesContext === "myCases" && <FaFileAlt className="text-xl" />}
        {casesContext === "realEstateCases" && (
          <FaShareAltSquare className="text-md" />
        )}
        {casesContext === "adminCases" && <RiAdminFill className="text-md" />}
        <h2 className="font-bold text-nowrap">
          {casesContext === "myCases" && user.isAutonomous ? "Propostas" : "Minhas Propostas"}{" "}
          {casesContext === "realEstateCases" && "Compartilhadas"}
          {casesContext === "adminCases" && "Admin"}
        </h2>
        {!user.isAutonomous &&
          (!casesContextDropdown ? (
            <FaCaretDown
              onClick={() => setCasesContextDropdown(true)}
              className="cursor-pointer text-[1.2rem]"
            />
          ) : (
            <FaCaretUp
              onClick={() => setCasesContextDropdown(false)}
              className="cursor-pointer text-[1.2rem]"
            />
          ))}

        {casesContextDropdown && <CasesContextSelect />}
      </div>
      <div className="ms-4 mt-4 md:mt-0 md:ms-0 flex gap-5 items-end flex-wrap">
        <div className="hidden md:flex items-center gap-5 text-xl mb-1 mr-5">
          <IoGrid
            onClick={() => setShowMode("cards")}
            className={` cursor-pointer ${
              showMode === "cards" ? "text-primary" : "text-grayScale-400"
            }`}
          />
          <FaTableList
            onClick={() => setShowMode("table")}
            className={` cursor-pointer ${
              showMode === "table" ? "text-primary" : "text-grayScale-400"
            }`}
          />
          {casesContext === "myCases" && (
            <MdViewKanban
              onClick={() => setShowMode("board")}
              className={` cursor-pointer text-2xl ${
                showMode === "board" ? "text-primary" : "text-grayScale-400"
              }`}
            />
          )}
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
    <div className={"flex justify-between flex-wrap gap-4 md:gap-0"}>
      <div className="flex gap-5 items-end flex-wrap">
        <SearchInput
          placeholder="Pesquisar"
          className="w-[300px]"
          debounceTimeout={500}
          handleDebounce={(v) => setSearch(v)}
        />
        <Select
          onChange={(_, v) => setType(v || "")}
          id="case-type-select"
          className="w-[300px]"
          defaultValue={type}
        >
          <Option value={""}>Todos</Option>
          <Option value={ProposalTypes.FinancamentoBancário}>Financiamento Bancário</Option>
          <Option value={ProposalTypes.ParcelamentoDireto}>Parcelamento Direto</Option>
        </Select>
        {casesContext === "realEstateCases" && (
          <CoWorkerSelect
            placeholder="Filtrar por colega"
            value={filterByUser}
            onChange={(v) => setFilterByUser(v)}
          />
        )}
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
      </div>
    </div>
  );

  const content = (
    <>
      {showMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 uw:grid-cols-8 gap-6 p-2 pe-4">
          {data.map((proposal) => (
            <CaseCard
              adminCase={casesContext === "adminCases"}
              realEstateCase={casesContext === "realEstateCases"}
              key={proposal.name}
              data={proposal}
            />
          ))}
        </div>
      )}

      {showMode === "table" && (
        <div className="p-2 pe-4">
          <Table color="neutral" variant="outlined">
            <thead>
              <tr>
                <th className="w-[500px] !bg-grayScale-100">Proposta</th>
                <th className="!bg-grayScale-100">Status</th>

                {casesContext === "adminCases" ||
                casesContext === "realEstateCases" ? (
                  <th className="!bg-grayScale-100">Criado por</th>
                ) : (
                  <th className="!bg-grayScale-100">Visualizações</th>
                )}
                <th className="!bg-grayScale-100">Criado em</th>
                <th className="!bg-grayScale-100">Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.map((proposal) => (
                <CaseTableRow
                  adminCase={casesContext === "adminCases"}
                  realEstateCase={casesContext === "realEstateCases"}
                  key={proposal.id}
                  data={proposal}
                />
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {showMode === "board" && (
        <ProposalBoard
          adminCase={casesContext === "adminCases"}
          realEstateCase={casesContext === "realEstateCases"}
          statuses={statuses}
          data={data}
        />
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
      footer={showMode === "board" ? null : footer}
    />
  );
}
