import { Chip, Divider, Typography } from "@mui/joy";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { toBRL } from "@/lib/formatter";
import { MdFileOpen } from "react-icons/md";
import { FaLink } from "react-icons/fa6";
import { FaExternalLinkAlt, FaPen } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import CaseFormModal from "../modals/CaseFormModal";
import { useState } from "react";
import { CaseStudy } from "@/types/caseTypes";

export const CaseStudyTypeLinkMap = {
  financingPlanning: "/planejamentofinanciamento",
};

const CaseCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  const [casestudy, setCaseStudy] = useState(caseStudy);
  const [editOrNewCaseModal, setEditOrNewCaseModal] = useState(false);
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

      <div className="absolute  w-[260px] left-0 bottom-0 mb-2 px-2">
        <Divider className="!mt-2 !mb-2" />
        <div className="flex justify-evenly gap-2 items-center py-1 text-blackish px-2">
          <FaPen
            onClick={() => setEditOrNewCaseModal(true)}
            className="text-md  cursor-pointer"
          />
          <FaTrash className="text-md  cursor-pointer" />
          <FaMagnifyingGlass className="text-md cursor-pointer" />
          <Link to={"/proposta/" + caseStudy.id}>
            <FaExternalLinkAlt className="text-md cursor-pointer" />
          </Link>

          <FaLink className="text-xl cursor-pointer" />
          <Link
            to={
              CaseStudyTypeLinkMap[
                casestudy.type as keyof typeof CaseStudyTypeLinkMap
              ] +
              "/" +
              casestudy.id
            }
          >
            <MdFileOpen className="text-xl" />
          </Link>
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
    </div>
  );
};

export default CaseCard;
