/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import { ErrorAlert, propertyDataError } from "@/components/errorAlert";
import { caseDataContext } from "./CaseData";
import { calcCaseData } from "./Calculator";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import { FaFile, FaSave } from "react-icons/fa";
import DetailedTable from "./DetailedTable";
import Conclusion from "./Conclusion";
import PropertyDataCard from "@/propertyData/ProperyDataCard";
import FinancingPlanningNewCase from "../../NewCase";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { useParams } from "react-router-dom";
import { caseService } from "@/service/caseService";
import GlobalLoading from "@/components/Loading";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { CaseStudy } from "@/types/caseTypes";
import FinancingPlanningReport from "@/reports/financingPlanningReport/FinancingPlanningReport";
import CaseFormModal from "@/components/modals/CaseFormModal";

export default function FinancingPlanning() {
  const { id } = useParams();

  const { propertyData, setMultiplePropertyData } =
    useContext(propertyDataContext);
  const [errors, setErrors] = useState<propertyDataError[]>([]);
  const [report, setReport] = useState(false);
  const { caseData, setCaseData } = useContext(caseDataContext);
  const [newCase, setNewCase] = useState(!id);
  const [caseFormModal, setCaseFormModal] = useState(false);
  const [actualCase, setActualCase] = useState<CaseStudy>();
  const [getCaseLoading, setGetCaseLoading] = useState(false);
  const [editOrNewCaseModal, setEditOrNewCaseModal] = useState(false);
  const [editChoose, setEditChoose] = useState(false);

  const buttons = [
    ...(actualCase
      ? [
          {
            onClick: () => setReport(true),
            icon: <FaFile />,
            tooltip: "Acessar relatório",
          },
        ]
      : []),
    {
      onClick: () => {
        if (id) {
          setEditOrNewCaseModal(true);
        } else {
          setCaseFormModal(true);
        }
      },
      icon: <FaSave />,
      tooltip: "Salvar Case",
    },
  ];

  useEffect(() => {
    if (id) {
      setGetCaseLoading(true);
      caseService.getCaseById(id).then((response) => {
        if (response) {
          setGetCaseLoading(false);
          setMultiplePropertyData(response.propertyData);
          setActualCase(response);
          localStorage.setItem(
            "financingPlanningPropertyData",
            JSON.stringify(response.propertyData)
          );
        }
      });
    }
  }, [id]);

  useEffect(() => {
    const newErrors: propertyDataError[] = [];
    if (!propertyData) return;

    if (propertyData.finalYear > 35 || propertyData.financingYears > 35) {
      newErrors.push({
        title: "Ano final ou tempo de financiamento inválido.",
        message: "Prazo do financimaneto é de no máximo 35 anos",
      });
    }

    setCaseData(calcCaseData(propertyData));

    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
  }, [propertyData]);

  if (newCase)
    return <FinancingPlanningNewCase setNewCase={(v) => setNewCase(v)} />;

  if (getCaseLoading && !actualCase)
    return <GlobalLoading text="Carregando case..." />;

  if (!propertyData) return null;

  if (report && actualCase)
    return (
      <FinancingPlanningReport
        onClose={() => setReport(false)}
        propertyData={propertyData}
        caseData={caseData}
        actualCase={actualCase}
      />
    );

  return (
    <>
      <div className="relative">
        <h1 className="scroll-m-20 text-xl text-primary text-center my-3">
          {actualCase?.name} {actualCase?.propertyName && " - "}
          {actualCase?.propertyName}
        </h1>
        <PropertyDataCard />
        <div className="w-full text-center ">
          {errors.length === 0 ? (
            <>
              <div className="grid grid-cols-12 px-0 gap-3 justify-center mt-5 mb-5 px-5">
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
            </>
          ) : (
            <div
              className={
                "grid place-items-center gap-2 mt-5 lg:px-32" +
                (errors.length % 2 === 0 ? " md:grid-cols-2" : " grid-cols-1")
              }
            >
              {errors.map((e) => (
                <ErrorAlert message={e.message} title={e.title} />
              ))}
            </div>
          )}
        </div>
        <FloatingButtonList buttons={buttons} />
      </div>
      <CaseFormModal
        actualCase={actualCase}
        editChoose={editChoose}
        open={caseFormModal}
        onClose={() => setCaseFormModal(false)}
        caseType="financingPlanning"
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
    </>
  );
}
