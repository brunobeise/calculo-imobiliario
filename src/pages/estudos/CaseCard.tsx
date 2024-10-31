import {
  Chip,
  Typography,
  Menu,
  MenuItem,
  Dropdown,
  MenuButton,
} from "@mui/joy";
import dayjs from "dayjs";
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
import placehodler from "./placeholder.jpg";

const CaseCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
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

  const isAnyModalOpen = editOrNewCaseModal || sessionsModal || deleteModal;

  return (
    <div
      onClick={() => {
        if (isAnyModalOpen) return;
        const url =
          CaseStudyTypeLinkMap[
            casestudy.type as keyof typeof CaseStudyTypeLinkMap
          ] +
          "/" +
          casestudy.id;
        toggleMenu(false);
        toggleBackdrop(false);
        window.location.href = url;
      }}
      className={`relative overflow-hidden h-[280px] rounded-[12px] shadow-md duration-300 px-5 pt-[150px] pb-20 flex flex-col 
                  bg-white cursor-pointer hover:shadow-xl`}
    >
      <div className="absolute w-full top-0 left-0">
        <div className="h-[150px] overflow-hidden flex justify-center items-top relative w-full">
          <img className="w-full" src={casestudy.mainPhoto || placehodler} />
          <div className="absolute bottom-0 h-[50px] w-full bg-gradient-to-t from-[#000000de] to-transparent flex items-center px-10 text-lg font-light" />
        </div>
      </div>
      <Dropdown>
        <MenuButton
          variant="outlined"
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="!absolute !top-1 !right-1 w-min !rounded-full !p-0 !px-1 !border-none"
        >
          <FaEllipsisV className="text-grayText" />
        </MenuButton>
        <Menu size="sm">
          <MenuItem
            onClick={(e) => {
              setEditOrNewCaseModal(true);
              e.stopPropagation();
            }}
          >
            <FaPen className="mr-2" /> Editar
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              setDeleteModal(true);
              e.stopPropagation();
            }}
          >
            <FaTrash className="mr-2" /> Excluir
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              setSessionsModal(true);
              e.stopPropagation();
            }}
          >
            <FaMagnifyingGlass className="mr-2" /> Detalhes da Sessão
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              window.open(`/proposta/${caseStudy.id}`, "_blank");
              e.stopPropagation();
            }}
          >
            <FaExternalLinkAlt className="mr-2" /> Abrir Proposta
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(
                "https://app.imobdeal.com.br/proposta/" + caseStudy.id
              );
              notify("info", "Link copiado para o clipboard");
            }}
          >
            <FaLink className="mr-2" /> Copiar Link
          </MenuItem>
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
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

      <div className="mb-4 mt-4">
        <Typography className="font-bold text-lg text-gray-800" level="h4">
          {casestudy.name}
        </Typography>
        <Typography level="body-sm">{casestudy.propertyName}</Typography>
      </div>

      <div className="absolute bottom-4 left-4">
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
      </div>

      <div className="absolute bottom-4 right-4 text-gray text-sm">
        {dayjs(casestudy.createdAt).format("DD/MM/YYYY")}
      </div>

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
    </div>
  );
};

export default CaseCard;
