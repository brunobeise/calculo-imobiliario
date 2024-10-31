import { Chip, Menu, MenuItem, Dropdown, MenuButton } from "@mui/joy";
import { useState } from "react";
import { CaseStudy } from "@/types/caseTypes";
import { notify } from "@/notify";
import { CaseStudyTypeLinkMap } from "@/lib/maps";
import { caseService } from "@/service/caseService";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { fetchCases } from "@/store/caseReducer";
import CaseFormModal from "@/components/modals/CaseFormModal";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import CaseSessionsModal from "./CaseSessionsModal";
import { useMenu } from "@/components/menu/MenuContext";
import {
  FaEllipsisV,
  FaExternalLinkAlt,
  FaPen,
  FaTrash,
  FaLink,
} from "react-icons/fa";
import { MdFileOpen } from "react-icons/md";
import { FaMagnifyingGlass } from "react-icons/fa6";
import dayjs from "dayjs";


const CaseTableRow = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toggleBackdrop, toggleMenu } = useMenu();

  const [casestudy, setCaseStudy] = useState(caseStudy);
  const [editOrNewCaseModal, setEditOrNewCaseModal] = useState(false);
  const [sessionsModal, setSessionsModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    setDeleteLoading(true);
    if (!casestudy?.id) return;
    try {
      await caseService.updateCase(casestudy.id, {
        isArchived: true,
      });
      dispatch(fetchCases());
    } catch (error) {
      console.error("Erro ao editar case:", error);
    } finally {
      setDeleteModal(false);
      setDeleteLoading(false);
    }
  };

  return (
    <tr>
      <td>
        {casestudy.mainPhoto && (
          <div className="w-[50px] h-[50px] flex justify-center items-center rounded-full overflow-hidden">
            <img
              src={casestudy.mainPhoto}
              alt={casestudy.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </td>
      <td>{casestudy.name}</td>
      <td>{casestudy.propertyName}</td>
      <td>{casestudy.description}</td>

      <td>
        {casestudy.shared && (
          <Chip
            size="sm"
            className="!bg-[#e3effb] !text-[#1a6abe] border border-[#1a6abe]"
            variant="solid"
            color="neutral"
          >
            Compartilhado
          </Chip>
        )}
      </td>
      <td>{dayjs(casestudy.createdAt).format("MM/DD/YYYY")}</td>
      <td>
        <Dropdown>
          <MenuButton className="w-min !rounded-full !p-0 !px-1 !border-none">
            <FaEllipsisV className="text-grayText" />
          </MenuButton>
          <Menu size="sm">
            <MenuItem onClick={() => setEditOrNewCaseModal(true)}>
              <FaPen className="mr-2" /> Editar
            </MenuItem>
            <MenuItem onClick={() => setDeleteModal(true)}>
              <FaTrash className="mr-2" /> Excluir
            </MenuItem>
            <MenuItem onClick={() => setSessionsModal(true)}>
              <FaMagnifyingGlass className="mr-2" /> Detalhes da Sessão
            </MenuItem>
            <MenuItem
              onClick={() => window.open(`/proposta/${caseStudy.id}`, "_blank")}
            >
              <FaExternalLinkAlt className="mr-2" /> Abrir Proposta
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigator.clipboard.writeText(
                  "https://app.imobdeal.com.br/proposta/" + caseStudy.id
                );
                notify("info", "Link copiado para o clipboard");
              }}
            >
              <FaLink className="mr-2" /> Copiar Link
            </MenuItem>
            <MenuItem
              onClick={() => {
                const url =
                  CaseStudyTypeLinkMap[
                    casestudy.type as keyof typeof CaseStudyTypeLinkMap
                  ] +
                  "/" +
                  casestudy.id;
                toggleMenu(false);
                toggleBackdrop(false);
                window.open(url, "_blank");
              }}
            >
              <MdFileOpen className="mr-2" /> Abrir Estudo
            </MenuItem>
          </Menu>
        </Dropdown>
      </td>

      {/* Modais */}
      <CaseFormModal
        actualCase={casestudy}
        editChoose={true}
        caseAdded={(c) => setCaseStudy({ ...casestudy, ...c })}
        open={editOrNewCaseModal}
        onClose={() => setEditOrNewCaseModal(false)}
        caseType="financingPlanning"
        propertyData={casestudy.propertyData}
      />
      <ConfirmationModal
        okLoading={deleteLoading}
        onOk={handleDelete}
        content="Deseja realmente excluir esse estudo?"
        onClose={() => setDeleteModal(false)}
        open={deleteModal}
      />
      <CaseSessionsModal
        open={sessionsModal}
        onClose={() => setSessionsModal(false)}
        caseId={casestudy.id}
      />
    </tr>
  );
};

export default CaseTableRow;
