/* eslint-disable no-unexpected-multiline */
import { Typography, Tooltip } from "@mui/joy";
import dayjs from "dayjs";
import { useState } from "react";
import { Proposal } from "@/types/proposalTypes";
import { getCaseLink } from "@/lib/maps";
import CaseSessionsModal from "../../components/session/SessionsModal";
import { useMenu } from "@/components/menu/MenuContext";
import { FaRegEye } from "react-icons/fa";
import placehodler from "./placeholder.jpg";
import { IoShareSocialSharp } from "react-icons/io5";
import StatusTag from "@/components/shared/CaseStatusTag";
import { navigate } from "vike/client/router";
import { FaExclamationCircle } from "react-icons/fa";
import ProposalDropdownMenu from "./ProposalDropdownMenu";

const CaseCard = ({
  data,
  realEstateCase,
  adminCase,
}: {
  data: Proposal;
  realEstateCase?: boolean;
  adminCase?: boolean;
}) => {
  const { toggleBackdrop, toggleMenu } = useMenu();

  const [proposal, setProposal] = useState(data);
  const [sessionsModal, setSessionsModal] = useState(false);
  const [hasNewSession, setHasNewSession] = useState(proposal.hasNewSession);

  return (
    <>
      <div
        onClick={() => {
          if (!realEstateCase) {
            toggleMenu(false);
            toggleBackdrop(false);
            navigate(`${getCaseLink(proposal.type)}/${proposal.id}`);
          } else {
            localStorage.setItem(
              "financingPlanningPropertyData",
              JSON.stringify(proposal.propertyData)
            );
            toggleMenu(false);
            toggleBackdrop(false);
            const url = getCaseLink(proposal.type) + "/?newCase=false";

            navigate(url);
          }
        }}
        className={`relative overflow-hidden min-h-[260px] rounded-[12px] shadow-md duration-300 px-5 pt-[150px] pb-10 flex flex-col 
                  bg-white cursor-pointer hover:shadow-lg`}
      >
        <div className="absolute w-full top-0 left-0">
          <div className="h-[150px] overflow-hidden flex justify-center items-top relative w-full">
            <img className="w-full" src={proposal.mainPhoto || placehodler} />
            <div className="absolute bottom-0 h-[50px] w-full bg-gradient-to-t from-[#000000de] to-transparent flex items-center px-10 text-lg font-light" />
          </div>
        </div>
        <ProposalDropdownMenu
          proposal={proposal}
          realEstateCase={realEstateCase}
        />
        {proposal.shared && (
          <Tooltip title="Estudo compartilhado">
            <div className=" text-primary border !absolute !top-2 !left-2 !p-[3px] !border-none !bg-white rounded-full shadow-lg">
              <IoShareSocialSharp className="text-md" />
            </div>
          </Tooltip>
        )}
        {!realEstateCase && !adminCase && (
          <Tooltip title={proposal.hasNewSession ? "Novas vizualizações!" : ""}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
                setHasNewSession(false);
                setSessionsModal(true);
              }}
              className={`relative text-primary !absolute top-[130px] !right-[-2px] rounded !bg-white  shadow flex gap-1 items-center justify-center h-10 w-14 hover:shadow-lg`}
            >
              {proposal._count?.sessions}
              <FaRegEye className="text-md mt-1" />
            </div>
          </Tooltip>
        )}

        {hasNewSession && !realEstateCase && !adminCase && (
          <FaExclamationCircle className="absolute top-[127px] !right-[44px] text-primary bg-white rounded-full border-[1px] border-white text-lg" />
        )}

        <div className="mt-4 mb-2">
          <Typography className="font-bold text-gray-800 !text-lg" level="h4">
            {proposal.name}
          </Typography>
          <Typography level="body-sm">{proposal.propertyName}</Typography>
        </div>
        <div className="mb-4">
          {realEstateCase ||
            (adminCase && (
              <StatusTag
                status={proposal.status}
                id={proposal.id}
                onChange={(s) => setProposal({ ...proposal, status: s })}
              />
            ))}
        </div>
        <div className="absolute bottom-4 left-4">
          {realEstateCase || adminCase ? (
            <div className="flex items-center text-sm">
              <div className="rounded-full overflow-hidden flex justify-center items-center w-[20px] h-[20px]">
                <img
                  src={
                    proposal.user?.photo ||
                    "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
                  }
                />
              </div>
              <div className="ms-2 flex flex-col">
                <span className="!text-md text-blackish">
                  {proposal.user?.fullName &&
                    `${
                      proposal.user.fullName.split(" ")[0]
                    } ${proposal.user.fullName
                      .split(" ")
                      [proposal.user.fullName.split(" ").length - 1].charAt(
                        0
                      )}.`}
                </span>
              </div>
            </div>
          ) : (
            <StatusTag
              status={proposal.status}
              id={proposal.id}
              onChange={(s) => setProposal({ ...proposal, status: s })}
              enableEdit
            />
          )}
        </div>
        <div className="absolute bottom-4 right-4 text-gray text-sm">
          {dayjs(proposal.createdAt).format("DD/MM/YYYY")}
        </div>
      </div>

      <CaseSessionsModal
        open={sessionsModal}
        onClose={() => setSessionsModal(false)}
        caseId={proposal.id}
      />
    </>
  );
};

export default CaseCard;
