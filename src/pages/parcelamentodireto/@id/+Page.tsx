/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import {
  PropertyData,
  propertyDataContext,
} from "@/propertyData/PropertyDataContext";

import { caseDataContext } from "./CaseData";
import { calcCaseData } from "./Calculator";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import { FaExternalLinkAlt, FaSave } from "react-icons/fa";
import DetailedTable from "./DetailedTable";
import Conclusion from "./Conclusion";
import NewCase from "../../../components/newCase";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { caseService } from "@/service/caseService";
import GlobalLoading from "@/components/Loading";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { Proposal } from "@/types/proposalTypes";
import CaseFormModal from "@/components/modals/CaseFormModal";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import { uploadImage } from "@/lib/imgur";
import CaseHeader from "@/components/shared/CaseHeader";
import CaseSubTypeSelect from "@/components/shared/CaseSubTypeSelect";
import ReportPreview from "@/reports/ReportPreview";
import { RiEdit2Fill } from "react-icons/ri";
import PropertyDataCards from "@/propertyData/propertyDataCards/PropertyDataCards";

export default function DirectFinancing(): JSX.Element {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;
  const { propertyData, setMultiplePropertyData } =
    useContext(propertyDataContext);
  const { caseData, setCaseData } = useContext(caseDataContext);
  const [newCase, setNewCase] = useState<boolean>(!id);
  const [caseFormModal, setCaseFormModal] = useState<boolean>(false);
  const [actualCase, setActualCase] = useState<Proposal | undefined>();
  const [getCaseLoading, setGetCaseLoading] = useState<boolean>(false);
  const [editOrNewCaseModal, setEditOrNewCaseModal] = useState<boolean>(false);
  const [editChoose, setEditChoose] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [newProposalSubType, setNewProposalSubType] = useState("");

  useEffect(() => {
    if (pageContext.urlParsed.search.newCase === "false") {
      setNewCase(false);
      const storedData = localStorage.getItem("DirectFinancingPropertyData");
      if (storedData) {
        setMultiplePropertyData(JSON.parse(storedData) as PropertyData);
      }
    }
  }, [pageContext]);

  useEffect(() => {
    if (id) {
      setGetCaseLoading(true);
      caseService.getCaseById(id).then((response) => {
        if (response) {
          setGetCaseLoading(false);
          setMultiplePropertyData(response.propertyData);
          setActualCase(response);
          localStorage.setItem(
            "DirectFinancingPropertyData",
            JSON.stringify(response.propertyData)
          );
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (!propertyData) return;
    setCaseData(calcCaseData(propertyData));
  }, [propertyData]);

  const handleSave = async () => {
    if (!actualCase?.id) return;
    setSaveLoading(true);

    let uploadMainPhoto = actualCase.mainPhoto;

    if (actualCase.mainPhoto && !actualCase.mainPhoto.startsWith("https://")) {
      uploadMainPhoto = await uploadImage(actualCase.mainPhoto);
    }

    const uploadAdditionalPhotos = await Promise.all(
      actualCase.additionalPhotos.map(async (photo) => {
        if (photo && !photo.startsWith("https://")) {
          const uploadedPhoto = await uploadImage(photo);
          return uploadedPhoto;
        }
        return photo;
      })
    );

    try {
      await caseService.updateCase(actualCase.id, {
        ...actualCase,
        propertyData: propertyData,
        subType: actualCase.subType,
        mainPhoto: uploadMainPhoto,
        additionalPhotos: uploadAdditionalPhotos,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRestart = () => {
    setNewCase(true);
    setActualCase(undefined);
    navigate("/parcelamentodireto");
  };

  const buttons = [
    {
      onClick: () => {
        if (id) {
          setEditOrNewCaseModal(true);
        } else {
          setCaseFormModal(true);
        }
      },
      icon: id ? <RiEdit2Fill /> : <FaSave />,
      tooltip: id ? "Editar" : "Salvar",
    },

    ...(actualCase
      ? [
          {
            icon: <FaExternalLinkAlt className="!text-[1.1rem]" />,
            tooltip: "Ver online",
            href: "/proposta/" + actualCase?.id,
          },
        ]
      : []),
    ...(actualCase
      ? [
          {
            onClick: () => handleSave(),
            icon: <FaSave />,
            tooltip: "Salvar",
            loading: saveLoading,
          },
        ]
      : []),
  ];

  const subType = actualCase ? actualCase?.subType : newProposalSubType;
  const tabParam = pageContext.urlParsed.search.tab as string | undefined;
  const isReportTab = tabParam !== "case";

  if (newCase)
    return (
      <NewCase
        setSubType={(v) => setNewProposalSubType(v)}
        setNewCase={(v) => setNewCase(v)}
      />
    );

  if (getCaseLoading) return <GlobalLoading text="Carregando estudo..." />;

  if (!propertyData) return <></>;

  return (
    <div className="bg-background min-h-screen">
      <CaseHeader
        actualCase={actualCase}
        setActualCase={setActualCase}
        onRestart={handleRestart}
      />

      {isReportTab && actualCase ? (
        <ReportPreview
          onChange={(data) => setActualCase({ ...actualCase, ...data })}
          propertyData={propertyData}
          context="directFinancing"
          proposal={actualCase}
        />
      ) : (
        <div className={`mt-[100px] ${actualCase ? "relative" : "relative mt-5"}`}>
          <CaseSubTypeSelect
            subType={subType}
            onChange={(value) => {
              if (actualCase) {
                setActualCase({ ...actualCase, subType: value });
              } else {
                setNewProposalSubType(value);
              }
            }}
          />
          <PropertyDataCards mode="directFinancing" type={subType} />

          {subType === "Avançado" && (
            <div className="w-full text-center ">
              <div className="grid grid-cols-12 gap-3 justify-center mt-5 mb-5 px-5">
                <Conclusion caseData={caseData} />

                <TableRentAppreciation
                  data={caseData.detailedTable.map((i) => i.rentValue)}
                  maxHeight={300}
                  border
                  text="left"
                  annualCollection={true}
                  title={true}
                  colspan={12}
                />
                <TablePropertyAppreciation
                  data={caseData.detailedTable.map((i) => i.propertyValue)}
                  propertyValue={propertyData.propertyValue}
                  totalValorization
                  maxHeight={300}
                  border
                  text="left"
                  annualCollection={true}
                  title={true}
                  colspan={12}
                />
                <DetailedTable detailedTable={caseData.detailedTable} />
              </div>
            </div>
          )}
        </div>
      )}
      <FloatingButtonList buttons={buttons} />
      <CaseFormModal
        subType={subType}
        actualCase={actualCase}
        editChoose={editChoose}
        open={caseFormModal}
        onClose={() => setCaseFormModal(false)}
        caseType="directFinancing"
        propertyData={propertyData}
      />

      <ConfirmationModal
        noText="Criar novo"
        yesText="Editar"
        content="Deseja editar o estudo atual ou criar um novo a partir desses dados?"
        onOk={() => {
          setEditChoose(true);
          setCaseFormModal(true);
          setEditOrNewCaseModal(false);
        }}
        open={editOrNewCaseModal}
        onClose={() => {
          setEditOrNewCaseModal(false);
          setEditChoose(false);
          setCaseFormModal(true);
        }}
      />
    </div>
  );
}
