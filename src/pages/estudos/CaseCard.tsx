import { Chip, Divider, Tooltip, Typography } from "@mui/joy";
import dayjs from "dayjs";

import { toBRL } from "@/lib/formatter";
import { MdFileOpen } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { FaExternalLinkAlt, FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
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

const CaseCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toggleBackdrop, toggleMenu} = useMenu()

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
    <div
      className={`relative overflow-hidden w-[260px]  rounded-[10px] duration-300 px-5 pt-3 pb-20 flex flex-col 
          shadow-[inset_0_-3em_3em_rgba(0,0,0,0.05),0_0_0_2px_rgb(190,190,190),0.3em_0.3em_0.5em_rgba(0,0,0,0.3)] hover:shadow-[inset_0_-3em_3em_rgba(0,0,0,0.12),0_0_0_2px_rgb(190,190,190),0.3em_0.3em_1em_rgba(0,0,0,0.3)]"
      }`}
    >
      <div className="mb-2">
        <div className="flex mb-2 ">
          <Typography className="!font-bold !text-primary" level="h4">
            {casestudy.name}
          </Typography>
        </div>
        <Divider />
      </div>
      <div className="mb-2 text-primary">
        <h3>{casestudy.propertyName}</h3>
      </div>
      <div className="text-[0.85em] text-blackish mb-2">
        <p>
          <strong>Valor do imóvel:</strong>{" "}
          {toBRL(casestudy.propertyData.propertyValue)}
        </p>
        <p>
          <strong>Entrada:</strong> {toBRL(casestudy.propertyData.downPayment)}
        </p>
        <p>
          <strong>Parcelas:</strong>{" "}
          {toBRL(casestudy.propertyData.installmentValue)}
        </p>
        <p className="mt-2">
          <strong>Criado em:</strong>{" "}
          {dayjs(casestudy.createdAt).format("MM/DD/YYYY")}
        </p>
      </div>
      <div className="absolute left-4 bottom-14">
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
      <div className="absolute w-[260px] left-0 bottom-0 mb-2 px-2">
        <Divider className="!mt-2 !mb-2" />
        <div className="flex justify-evenly gap-2 items-center py-1 text-blackish px-2">
          <Tooltip title="Editar" placement="bottom">
            <span>
              <FaPen
                onClick={() => setEditOrNewCaseModal(true)}
                className="text-md cursor-pointer"
              />
            </span>
          </Tooltip>

          <Tooltip title="Excluir" placement="bottom">
            <span>
              <FaTrash
                onClick={() => setDeleteModal(true)}
                className="text-md cursor-pointer"
              />
            </span>
          </Tooltip>

          <Tooltip title="Visualizar Detalhes de sessão" placement="bottom">
            <span>
              <FaMagnifyingGlass
                onClick={() => setSessionsModal(true)}
                className="text-md cursor-pointer"
              />
            </span>
          </Tooltip>

          <Tooltip title="Abrir link da proposta" placement="bottom">
            <span>
              <a target="_blank" href={"/proposta/" + caseStudy.id}>
                <FaExternalLinkAlt className="text-md cursor-pointer" />
              </a>
            </span>
          </Tooltip>

          <Tooltip title="Copiar link" placement="bottom">
            <span>
              <FaLink
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://app.imobdeal.com.br/proposta/" + caseStudy.id
                  );
                  notify("info", "Link copiado para o clipboard");
                }}
                className="text-xl cursor-pointer"
              />
            </span>
          </Tooltip>

          <Tooltip title="Abrir Estudo" placement="bottom">
            <span>
              <a
                href={
                  CaseStudyTypeLinkMap[
                    casestudy.type as keyof typeof CaseStudyTypeLinkMap
                  ] +
                  "/" +
                  casestudy.id
                }
                onClick={() => {
                  toggleMenu(false)
                  toggleBackdrop(false)
                }}
              >
                <MdFileOpen className="text-xl cursor-pointer" />
              </a>
            </span>
          </Tooltip>
        </div>
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
