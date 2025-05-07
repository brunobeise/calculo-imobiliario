import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Button, FormLabel, Option, Select } from "@mui/joy";
import SearchInput from "@/components/inputs/SearchInput";
import Pagination from "@/components/shared/Pagination";
import { FaPlusCircle, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

import PageStructure from "@/components/structure/PageStructure";

import { fetchPortfolios } from "@/store/portfolioReducer";
import { GrMultiple } from "react-icons/gr";
import PortfolioCard from "./PortfolioCard";
import PortfolioModal from "./PortfolioModal";
import PortfolioIntroModal from "./PortfolioIntroModal";

export default function MyPortfolios() {
  const dispatch = useDispatch<AppDispatch>();
  const { portfolios, loading } = useSelector(
    (state: RootState) => state.portfolio
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [orderBy, setOrderBy] = useState("createdAt");
  const [portfolioModal, setPortfolioModal] = useState(false);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [editPortfolioModal, setEditPortfolioModal] = useState<string>();

  const fetchData = useCallback(
    (params) => {
      dispatch(fetchPortfolios(params));
    },
    [dispatch]
  );

  useEffect(() => {
    const query = new URLSearchParams({
      search,
      currentPage: currentPage.toString(),
      limit: limit.toString(),
      orderBy,
      sortDirection,
    }).toString();
    fetchData(query);
  }, [search, currentPage, limit, orderBy, sortDirection, dispatch, fetchData]);

  const contentHeader = (
    <div className="flex gap-5 justify-between w-full flex-wrap">
      <SearchInput
        placeholder="Pesquisar portfólios"
        className="w-[300px]"
        debounceTimeout={500}
        handleDebounce={(v) => setSearch(v)}
      />
      <div className="flex gap-2 items-center">
        <FormLabel className="!text-[0.8rem]">Ordenar por:</FormLabel>
        <Select
          onChange={(_, v) => setOrderBy(v || "")}
          className="w-[120px]"
          size="sm"
          defaultValue={orderBy}
        >
          <Option value="name">Nome</Option>
          <Option value="createdAt">Data</Option>
          <Option value="clientName">Cliente</Option>
        </Select>
        <span className="cursor-pointer ms-2 text-gray">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 uw:grid-cols-8 gap-6 p-2 pe-4">
        {portfolios?.data.map((portfolio) => (
          <div
            onClick={() => {
              setEditPortfolioModal(portfolio.id);
              setPortfolioModal(true);
            }}
          >
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          </div>
        ))}
      </div>

      {!loading && portfolios?.data.length === 0 && (
        <div className="text-center mt-5 text-gray">
          Nenhum portfólio encontrado
        </div>
      )}
    </>
  );

  const header = (
    <div className="flex justify-between items-center ">
      <div className="w-full flex items-center text-primary gap-2  text-2xl ms-4 mt-8 mb-3">
        <GrMultiple />
        <h2 className="font-bold text-nowrap">Portfolios</h2>
      </div>
      <div className="mt-6">
        <Button
          className="text-nowrap "
          onClick={() => {
            setEditPortfolioModal("");
            setPortfolioModal(true);
          }}
          endDecorator={<FaPlusCircle />}
        >
          Novo Portfolio
        </Button>
      </div>
    </div>
  );

  const footer = (
    <Pagination
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      totalPages={1}
      onLimitChange={setLimit}
      limit={limit}
    />
  );

  return (
    <>
      <PageStructure
        header={header}
        contentHeader={contentHeader}
        content={content}
        loading={loading}
        footer={footer}
      />
      <PortfolioModal
        onClose={() => setPortfolioModal(false)}
        open={portfolioModal}
        portfolioId={editPortfolioModal}
        reload={() =>
          fetchData({
            search,
            currentPage: currentPage.toString(),
            limit: limit.toString(),
            orderBy,
            sortDirection,
          })
        }
      />
      <PortfolioIntroModal />
    </>
  );
}
