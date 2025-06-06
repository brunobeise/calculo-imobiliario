import { useState, useEffect, useRef } from "react";
import { Button, Checkbox } from "@mui/joy";

type StatusFilterProps = {
  onChange: (activeStatuses: string[]) => void;
  value: string[];
};

const statuses = ["Rascunho", "Em Análise", "Enviada", "Aceita", "Recusada"];

const StatusFilter = ({ value, onChange }: StatusFilterProps) => {
  const [activeStatuses, setActiveStatuses] = useState<string[]>(value);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveStatuses(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStatus = (status: string) => {
    let updatedStatuses;
    if (activeStatuses.includes(status)) {
      updatedStatuses = activeStatuses.filter((s) => s !== status);
    } else {
      updatedStatuses = [...activeStatuses, status];
    }
    setActiveStatuses(updatedStatuses);
    onChange(updatedStatuses);
  };

  const toggleSelectAll = () => {
    if (activeStatuses.length === statuses.length) {
      setActiveStatuses([]);
      onChange([]);
    } else {
      setActiveStatuses([...statuses]);
      onChange([...statuses]);
    }
  };

  const allSelected = activeStatuses.length === statuses.length;

  return (
    <div className="relative inline-block" ref={ref}>
      <Button
        variant="plain"
        type="button"
        className="px-4 py-2 border rounded bg-white"
        onClick={() => setDropdownOpen((prev) => !prev)}
      >
        Filtrar Status ({activeStatuses.length})
      </Button>

      {dropdownOpen && (
        <div className="absolute z-10 top-0 left-[160px] w-48 bg-white rounded shadow-lg">
          <div className="hover:bg-background p-3 cursor-pointer">
            <label className="flex items-center cursor-pointer ">
              <Checkbox
                size="sm"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="mr-2"
              />
              <span>Selecionar Todas</span>
            </label>
          </div>

          <div className="flex flex-col overflow-y-auto">
            {statuses.map((status) => (
              <div className="hover:bg-background p-3 cursor-pointer">
                <label
                  key={status}
                  className="flex items-center cursor-pointer"
                >
                  <Checkbox
                    size="sm"
                    checked={activeStatuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    className="mr-2"
                  />
                  <div>{status}</div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
