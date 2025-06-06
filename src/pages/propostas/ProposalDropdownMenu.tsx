import { Dropdown, Menu, MenuButton, MenuItem } from "@mui/joy";
import {
  FaEllipsisV,
  FaExternalLinkAlt,
  FaLink,
  FaTrash,
} from "react-icons/fa";
import { IoDuplicate } from "react-icons/io5";
import { Proposal } from "@/types/proposalTypes";
import { useState } from "react";
import { notify } from "@/notify";
import { caseService } from "@/service/caseService";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { fetchCases } from "@/store/caseReducer";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import ProposalFormModal from "@/components/modals/ProposalFormModal";

export default function ProposalDropdownMenu({
  proposal,
  realEstateCase = false,
  size = "large",
  onDelete,
  inTop = true,
}: {
  proposal: Proposal;
  realEstateCase?: boolean;
  size?: "small" | "large";
  onDelete?: (id: string) => void;
  inTop?: boolean;
}) {
  const [duplicateCase, setDuplicateCase] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await caseService.updateCase(proposal.id, {
        isArchived: true,
      });
      dispatch(fetchCases({ type: proposal.type }));
    } catch (error) {
      console.error("Erro ao excluir proposta:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteModal(false);
    }
  };

  return (
    <>
      <Dropdown>
        {size === "small" ? (
          <MenuButton
            variant="solid"
            onClick={(event) => event.stopPropagation()}
            size="sm"
            className={`${
              inTop ? "!absolute !top-1 !right-1" : ""
            }  !px-0 !text-grayScale-400 hover:!text-grayScale-700 border !border-none !bg-whitefull rounded-full shadow-none `}
          >
            <FaEllipsisV />
          </MenuButton>
        ) : (
          <MenuButton
            variant="solid"
            onClick={(event) => event.stopPropagation()}
            size="sm"
            className={
              "!absolute !top-1 !right-1 !px-1 !text-primary border !border-none !bg-white rounded-full shadow-lg hover:!bg-grayScale-100"
            }
          >
            <FaEllipsisV />
          </MenuButton>
        )}

        <Menu size="sm">
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/proposta/${proposal.id}`, "_blank");
            }}
          >
            <FaExternalLinkAlt className="mr-2" /> Abrir Proposta
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(
                `https://app.imobdeal.com.br/proposta/${proposal.id}`
              );
              notify("info", "Link copiado para o clipboard");
            }}
          >
            <FaLink className="mr-2" /> Copiar Link
          </MenuItem>

          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              setDuplicateCase(true);
            }}
          >
            <IoDuplicate className="mr-2" /> Duplicar
          </MenuItem>

          {!realEstateCase && (
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setDeleteModal(true);
              }}
            >
              <FaTrash className="mr-2" /> Excluir
            </MenuItem>
          )}
        </Menu>
      </Dropdown>

      <ProposalFormModal
        duplicate
        open={!!duplicateCase}
        initialData={proposal}
        onClose={() => setDuplicateCase(undefined)}
      />

      <ConfirmationModal
        okLoading={deleteLoading}
        onOk={onDelete ? () => onDelete(proposal.id) : handleDelete}
        content="Deseja realmente excluir esse estudo?"
        onClose={() => setDeleteModal(false)}
        open={deleteModal}
      />
    </>
  );
}
