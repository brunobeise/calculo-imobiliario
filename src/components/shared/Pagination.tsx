import { FormLabel, Option, Select } from "@mui/joy";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  onLimitChange,
  limit,
}: PaginationProps) => {
  const maxVisibleButtons = 5;

  const getPaginationRange = () => {
    const range = [];
    const halfRange = Math.floor(maxVisibleButtons / 2);

    let start = Math.max(1, currentPage - halfRange);
    let end = Math.min(totalPages, currentPage + halfRange);

    if (currentPage <= halfRange) {
      end = Math.min(totalPages, maxVisibleButtons);
    } else if (currentPage + halfRange >= totalPages) {
      start = Math.max(1, totalPages - maxVisibleButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="relative h-[40px]">
      <div className="flex justify-center items-center space-x-2 mt-4">
        {totalPages !== 0 && currentPage !== 1 && (
          <button
            className={`px-3 py-1 rounded-full  w-8 h-8 flex justify-center items-center bg-grayScale-100 hover:bg-grayScale-200`}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <span>
              <FaAngleLeft />
            </span>
          </button>
        )}

        {getPaginationRange().map((page, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-full ${
              currentPage === page
                ? "bg-primary text-white"
                : "bg-secondary hover:bg-grayScale-300"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {totalPages > 1 &&
          currentPage + Math.floor(maxVisibleButtons / 2) < totalPages && (
            <span className="px-3 py-1 text-grayScale-500">...</span>
          )}

        {currentPage !== totalPages && totalPages !== 0 && (
          <button
            className={`px-3 py-1 rounded-full w-8 h-8 flex justify-center items-center ${
              currentPage === totalPages
                ? "bg-grayScale-200 cursor-not-allowed"
                : "bg-grayScale-100 hover:bg-grayScale-200"
            }`}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <FaAngleRight />
          </button>
        )}
      </div>
      {onLimitChange && totalPages !== 0 && (
        <div className="absolute right-0 top-0 flex gap-2">
          <FormLabel>Limite:</FormLabel>
          <Select
            value={limit}
            onChange={(_, v) => onLimitChange(Number(v) || 10)}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
          </Select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
