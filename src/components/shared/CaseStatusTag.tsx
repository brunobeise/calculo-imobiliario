import { getBadgeType } from "@/lib/maps";
import { caseService } from "@/service/caseService";
import { Dropdown, IconButton, Menu, MenuButton, MenuItem } from "@mui/joy";
import { FaChevronDown } from "react-icons/fa";
import Badge from "./Badge";

const StatusTag = ({
  status,
  id,
  onChange,
  enableEdit,
}: {
  status: string;
  id: string;
  onChange: (status: string) => void;
  enableEdit?: boolean;
}) => {
  const handleStatusChange = async (newStatus: string | null) => {
    if (!newStatus) return;
    try {
      await caseService.updateCase(id, {
        status: newStatus,
      });
      onChange(newStatus);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  return (
    <div className="!relative">
      <Badge type={getBadgeType(status)}>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {enableEdit ? (
            <Dropdown>
              <MenuButton
                slots={{ root: IconButton }}
                slotProps={{
                  root: {
                    variant: "plain",
                    color: "neutral",
                    sx: {
                      padding: 0,
                      minWidth: "auto",
                      color: "inherit",
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "inherit",
                      },
                      "&:focus": {
                        outline: "none",
                      },
                    },
                  },
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs"> {status}</span>{" "}
                  <FaChevronDown className="text-[0.6rem]" />{" "}
                </div>
              </MenuButton>
              <Menu
                size="sm"
                onClick={(e) => e.stopPropagation()}
                className="z-10 !absolute"
              >
                <MenuItem onClick={() => handleStatusChange("Rascunho")}>
                  Rascunho
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange("Em Análise")}>
                  Em Análise
                </MenuItem>
                <MenuItem
                  onClick={() => handleStatusChange("Enviada")}
                >
                  Enviada
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange("Aceita")}>
                  Aceita
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange("Recusada")}>
                  Recusada
                </MenuItem>
              </Menu>
            </Dropdown>
          ) : (
            <span className="text-xs"> {status}</span>
          )}
        </div>
      </Badge>
    </div>
  );
};

export default StatusTag;
