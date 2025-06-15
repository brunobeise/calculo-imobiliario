import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import {
  FaEllipsisV,
  FaTrash,
  FaEdit,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { Portfolio } from "@/types/portfolioTypes"; // Ajuste o caminho se necessário
import { useState } from "react";
import { notify } from "@/notify";
import { portfolioService } from "@/service/portfolioService"; // Presumindo que exista
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import PortfolioModal from "./PortfolioModal";

export default function PortfolioCardDropdownMenu({
  portfolio,
  size = "large",
  reload,
}: {
  portfolio: Portfolio;
  size?: "small" | "large";
  onDelete?: (id: string) => void;
  reload: () => void;
}) {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editPortfolioModal, setEditPortfolioModal] = useState<string>();

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await portfolioService.deletePortfolio(portfolio.id);
      reload();
    } catch (error) {
      console.error("Erro ao excluir portfólio:", error);
      notify("error", "Erro ao excluir portfólio");
    } finally {
      setDeleteLoading(false);
      setDeleteModal(false);
    }
  };

  return (
    <>
      <Dropdown>
        <MenuButton
          variant="solid"
          onClick={(e) => e.stopPropagation()}
          size={size === "small" ? "sm" : "md"}
          className={`${"!absolute !top-1 !right-1"} !px-1 !text-primary border !border-none rounded-full shadow-lg  !bg-white z-10`}
        >
          <FaEllipsisV />
        </MenuButton>

        <Menu size="sm">
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `/portfolio/${portfolio.link || portfolio.id}`,
                "_blank"
              );
            }}
          >
            <FaExternalLinkAlt className="mr-2" /> Ver Online
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setEditPortfolioModal(portfolio.id);
            }}
          >
            <FaEdit className="mr-2" /> Editar Itens
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDeleteModal(true);
            }}
          >
            <FaTrash className="mr-2" /> Excluir
          </MenuItem>
        </Menu>
      </Dropdown>

      <PortfolioModal
        onClose={() => setEditPortfolioModal(undefined)}
        open={!!editPortfolioModal}
        portfolioId={editPortfolioModal}
        reload={reload}
        showConfig={false}
      />

      <ConfirmationModal
        okLoading={deleteLoading}
        onOk={handleDelete}
        content="Deseja realmente excluir este portfólio?"
        onClose={() => setDeleteModal(false)}
        open={deleteModal}
      />
    </>
  );
}
