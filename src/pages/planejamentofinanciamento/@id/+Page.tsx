/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import ErrorAlert, { propertyDataError } from "@/components/errorAlert";
import { caseDataContext } from "./CaseData";
import { calcCaseData } from "./Calculator";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import { FaBook, FaEdit, FaFile, FaSave } from "react-icons/fa";
import DetailedTable from "./DetailedTable";
import Conclusion from "./Conclusion";
import PropertyDataCard from "@/propertyData/ProperyDataCard";
import NewCase from "../../../components/newCase";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { caseService } from "@/service/caseService";
import GlobalLoading from "@/components/Loading";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { CaseStudy } from "@/types/caseTypes";
import FinancingPlanningReport from "@/reports/financingPlanningReport/FinancingPlanningReport";
import CaseFormModal from "@/components/modals/CaseFormModal";
import {
  Button,
  Divider,
  Tab,
  tabClasses,
  TabList,
  Tabs,
  Tooltip,
} from "@mui/joy";
import { MdRestartAlt } from "react-icons/md";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";

export default function FinancingPlanning() {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;

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
  const [saveLoading, setSaveLoading] = useState(false);

  const buttons = [
    {
      onClick: () => {
        if (id) {
          setEditOrNewCaseModal(true);
        } else {
          setCaseFormModal(true);
        }
      },
      icon: id ? <FaEdit /> : <FaSave />,
      tooltip: id ? "Editar Case" : "Salvar Case",
    },
    ...(actualCase
      ? [
          {
            onClick: () => handleSave(),
            icon: <FaSave />,
            tooltip: "Salvar Case",
            loading: saveLoading,
          },
        ]
      : []),
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

  if (newCase) return <NewCase setNewCase={(v) => setNewCase(v)} />;

  if (getCaseLoading && !actualCase)
    return <GlobalLoading text="Carregando case..." />;

  if (!propertyData) return null;

  const handleSave = async () => {
    setSaveLoading(true);
    if (!actualCase?.id) return;
    try {
      await caseService.updateCase(actualCase.id, {
        propertyData: propertyData,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (report && actualCase)
    return (
      <>
        <div className="absolute  top-[0.6rem] left-[4rem] z-10">
          <Tooltip title="Recomeçar estudo" placement="left-end">
            <Button
              variant="plain"
              className="!p-0 !px-1"
              onClick={() => {
                setNewCase(true);
                setActualCase(undefined);
                navigate("/planejamentofinanciamento");
              }}
            >
              <MdRestartAlt className="text-xl text-grayText" />
            </Button>
          </Tooltip>
        </div>
        <Tabs
          defaultValue={"report"}
          aria-label="tabs"
          sx={{ bgcolor: "transparent" }}
          className="!absolute !right-[2rem] top-[2rem]"
        >
          <TabList
            disableUnderline
            sx={{
              justifyContent: "center",
              p: 0.5,
              gap: 0.5,
              borderRadius: "xl",
              bgcolor: "transparent",
              [`& .${tabClasses.root}[aria-selected="true"]`]: {
                boxShadow: "sm",
                bgcolor: "background.surface",
              },
            }}
          >
            <div onClick={() => setReport(false)}>
              <Tab className="!text-primary" value="case">
                <FaBook className="text-sm" />{" "}
                <span className="font-bold"> Estudo </span>{" "}
              </Tab>
            </div>
            <div onClick={() => setReport(true)}>
              <Tab className="!text-primary" value="report">
                <FaFile className="text-sm" />{" "}
                <span className="font-bold">Relatório </span>
              </Tab>
            </div>
          </TabList>
        </Tabs>
        <h1 className="scroll-m-20 text-xl text-primary text-center mt-3">
          {actualCase?.name} {actualCase?.propertyName && " - "}
          {actualCase?.propertyName}
        </h1>
        <Divider className="!mt-3" />
        <FinancingPlanningReport
          onClose={() => setReport(false)}
          propertyData={propertyData}
          caseData={caseData}
          actualCase={actualCase}
        />
      </>
    );

  return (
    <>
      {actualCase && (
        <>
          <Tabs
            defaultValue={"case"}
            aria-label="tabs"
            sx={{ bgcolor: "transparent" }}
            className="!absolute !right-[2rem] top-[2rem]"
          >
            <TabList
              disableUnderline
              sx={{
                justifyContent: "center",
                p: 0.5,
                gap: 0.5,
                borderRadius: "xl",
                bgcolor: "transparent",
                [`& .${tabClasses.root}[aria-selected="true"]`]: {
                  boxShadow: "sm",
                  bgcolor: "background.surface",
                },
              }}
            >
              <div onClick={() => setReport(false)}>
                <Tab className="!text-primary" value="case">
                  <FaBook className="text-sm" />{" "}
                  <span className="font-bold"> Estudo </span>{" "}
                </Tab>
              </div>
              <div onClick={() => setReport(true)}>
                <Tab className="!text-primary" value="report">
                  <FaFile className="text-sm" />{" "}
                  <span className="font-bold">Relatório </span>
                </Tab>
              </div>
            </TabList>
          </Tabs>
          <h1 className="scroll-m-20 text-xl text-primary text-center mt-3">
            {actualCase?.name} {actualCase?.propertyName && " - "}
            {actualCase?.propertyName}
          </h1>
          <Divider className="!mt-3" />
        </>
      )}

      <div className="absolute top-[0.6rem] left-[4rem] z-10">
        <Tooltip title="Recomeçar estudo" placement="left-end">
          <Button
            variant="plain"
            className="!p-0 !px-1"
            onClick={() => {
              setNewCase(true);
              setActualCase(undefined);
              navigate("/planejamentofinanciamento");
            }}
          >
            <MdRestartAlt className="text-xl text-grayText" />
          </Button>
        </Tooltip>
      </div>

      <div className={`${actualCase ? "relative" : "relative mt-5"}`}>
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
