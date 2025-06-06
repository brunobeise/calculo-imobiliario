import { Proposal } from "@/types/proposalTypes";
import { BsFillHouseFill } from "react-icons/bs";
import dayjs from "dayjs";
import SearchInput from "../inputs/SearchInput";
import { Spinner } from "../Loading";
import ProposalFormModal from "../modals/ProposalFormModal";
import { useState } from "react";

interface MyCasesProps {
  myCases: Proposal[];
  loading: boolean;
  onSearch: (search: string) => void;
}

export default function MyCases({ myCases, loading, onSearch }: MyCasesProps) {
  const [proposalModal, setProposalModal] = useState<Proposal>();

  return (
    <div className="flex flex-col gap-5 w-full max-w-[500px]">
      <SearchInput
        placeholder="Pesquisar"
        debounceTimeout={500}
        className="w-full"
        handleDebounce={onSearch}
      />
      <div className=" border border-grayScale-200 rounded shadow-lg overflow-y-auto h-[500px] w-[500px]">
        {loading ? (
          <div className="flex justify-center items-center h-[400px]">
            <Spinner />
          </div>
        ) : myCases.length === 0 ? (
          <p className="text-center font-bold mt-5">
            Nenhuma proposta encontrada :(
          </p>
        ) : (
          myCases.map((c) => (
            <>
              <div
                key={c.id}
                className="cursor-pointer bg-white border-b border-grayScale-200 hover:bg-gray-100 flex gap-3 p-3 items-center"
                onClick={() => setProposalModal(c)}
              >
                {c.mainPhoto ? (
                  <img
                    src={c.mainPhoto}
                    alt={c.name}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded flex items-center justify-center flex-shrink-0">
                    <BsFillHouseFill className="text-grayScale-600 text-xl" />
                  </div>
                )}

                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  {c.propertyName && (
                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <BsFillHouseFill /> {c.propertyName}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                    <span>{dayjs(c.createdAt).format("DD/MM/YYYY")}</span>
                  </div>
                </div>
              </div>
            </>
          ))
        )}
      </div>
      <ProposalFormModal
        open={!!proposalModal}
        onClose={() => setProposalModal(undefined)}
        duplicate
        initialData={proposalModal}
      />
    </div>
  );
}
