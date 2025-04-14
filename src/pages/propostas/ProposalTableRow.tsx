/* eslint-disable no-unexpected-multiline */
import {
  Dropdown,
  Menu,
  MenuButton,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/joy";
import {
  FaEllipsisV,
  FaLink,
  FaTrash,
  FaExternalLinkAlt,
  FaRegEye,
  FaExclamationCircle,
} from "react-icons/fa";
import { IoDuplicate } from "react-icons/io5";
import dayjs from "dayjs";
import { useState } from "react";
import { Proposal } from "@/types/proposalTypes";
import StatusTag from "@/components/shared/CaseStatusTag";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import DuplicateCaseModal from "./DuplicateCaseModal";
import CaseSessionsModal from "@/components/session/SessionsModal";
import { notify } from "@/notify";
import { navigate } from "vike/client/router";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { getCaseLink } from "@/lib/maps";
import { IoHomeOutline } from "react-icons/io5";

const CaseTableRow = ({
  data,
  realEstateCase,
  adminCase,
}: {
  data: Proposal;
  realEstateCase?: boolean;
  adminCase?: boolean;
}) => {
  const [deleteModal, setDeleteModal] = useState(false);
  const [sessionsModal, setSessionsModal] = useState(false);
  const [proposal, setProposal] = useState<Proposal>(data);
  const [duplicateCase, setDuplicateCase] = useState<Proposal | undefined>();
  const [hasNewSession, setHasNewSession] = useState(proposal.hasNewSession);

  return (
    <tr
      onClick={() => navigate(`${getCaseLink(proposal.type)}/${proposal.id}`)}
      className="cursor-pointer hover:bg-grayScale-50 h-24"
    >
      <td className="w-[300px]">
        <div className="flex  gap-3 ms-4">
          {proposal.mainPhoto ? (
            <img
              src={proposal.mainPhoto}
              alt={proposal.name}
              className="w-16 h-16 rounded object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded bg-grayScale-100 flex items-center justify-center">
              <IoHomeOutline className="text-grayScale-600" />
            </div>
          )}
          <div className="flex flex-col">
            <Typography level="h4" className="font-semibold">
              {proposal.name}
            </Typography>
            <Typography level="body-md" className="!text-grayScale-500">
              {proposal.propertyName}
            </Typography>
          </div>
        </div>
      </td>

      <td>
        <StatusTag
          status={proposal.status}
          id={proposal.id}
          onChange={(s) => setProposal({ ...proposal, status: s })}
          enableEdit
        />
      </td>
      <td>
        {!realEstateCase && !adminCase ? (
          <Tooltip title={proposal.hasNewSession ? "Novas vizualizações!" : ""}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
                setHasNewSession(false);
                setSessionsModal(true);
              }}
              className={`text-primary rounded  flex gap-1 items-center justify-center h-10 w-14 relative`}
            >
              <span>{proposal._count?.sessions} </span>
              <FaRegEye className="text-md" />
              {hasNewSession && !realEstateCase && !adminCase && (
                <FaExclamationCircle className="absolute text-primary top-[-2px] right-[-2px] bg-white rounded-full border-[1px] border-white text-lg" />
              )}
            </div>
          </Tooltip>
        ) : (
          <div className="flex items-center text-sm">
            <div className="rounded-full overflow-hidden flex justify-center items-center w-7 h-7">
              <img
                src={
                  proposal.user?.photo ||
                  "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
                }
              />
            </div>
            <div className="ms-2 flex flex-col">
              <span className="!text-[1rem] text-blackish">
                {proposal.user?.fullName}
              </span>
            </div>
          </div>
        )}
      </td>

      <td>{dayjs(proposal.createdAt).format("DD/MM/YYYY")}</td>
      <td>
        <Dropdown>
          <MenuButton
            onClick={(e) => e.stopPropagation()}
            variant="plain"
            size="sm"
          >
            <FaEllipsisV />
          </MenuButton>
          <Menu size="sm">
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                setSessionsModal(true);
              }}
            >
              <FaMagnifyingGlass className="mr-2" /> Ver Sessões
            </MenuItem>
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
                setDuplicateCase(proposal);
              }}
            >
              <IoDuplicate className="mr-2" /> Duplicar
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
      </td>

      <DuplicateCaseModal
        data={duplicateCase}
        onClose={() => setDuplicateCase(undefined)}
      />
      <ConfirmationModal
        content="Deseja realmente excluir esse estudo?"
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onOk={() => {}}
      />
      <CaseSessionsModal
        open={sessionsModal}
        onClose={() => setSessionsModal(false)}
        caseId={proposal.id}
      />
    </tr>
  );
};

export default CaseTableRow;
