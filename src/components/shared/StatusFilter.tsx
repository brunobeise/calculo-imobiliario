import React, { useState } from "react";
import Badge from "./Badge";

type StatusFilterProps = {
  statuses: string[];
  onChange: (activeStatuses: string[]) => void;
};

const statusToBadgeType: Record<
  string,
  "default" | "danger" | "warning" | "success" | "info"
> = {
  Rascunho: "default",
  "Em Análise": "warning",
  Enviada: "info",
  Aceita: "success",
  Recusada: "danger",
};

const StatusFilter = ({ statuses, onChange }: StatusFilterProps) => {
  const [activeStatuses, setActiveStatuses] = useState<string[]>(statuses);

  const toggleStatus = (status: string) => {
    const updatedStatuses = activeStatuses.includes(status)
      ? activeStatuses.filter((s) => s !== status)
      : [...activeStatuses, status];

    setActiveStatuses(updatedStatuses);
    onChange(updatedStatuses);
  };

  return (
    <div className="flex gap-5">
      {statuses.map((status) => (
        <div
          key={status}
          className={`cursor-pointer transition-opacity ${
            activeStatuses.includes(status) ? "opacity-100" : "opacity-30"
          }`}
          onClick={() => toggleStatus(status)}
        >
          <Badge type={statusToBadgeType[status] || "default"}>{status}</Badge>
        </div>
      ))}
    </div>
  );
};

export default StatusFilter;
