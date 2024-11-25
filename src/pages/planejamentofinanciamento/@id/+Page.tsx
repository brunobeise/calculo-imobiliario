/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import {
  PropertyData,
  propertyDataContext,
} from "@/propertyData/PropertyDataContext";
import ErrorAlert, { propertyDataError } from "@/components/errorAlert";
import { caseDataContext } from "./CaseData";
import { calcCaseData } from "./Calculator";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import { FaBook, FaCalculator, FaEdit, FaFile, FaSave } from "react-icons/fa";
import DetailedTable from "./DetailedTable";
import Conclusion from "./Conclusion";
import PropertyDataCard from "@/propertyData/ProperyDataCard";
import NewCase from "../../../components/newCase";
import FloatingButtonList from "@/components/shared/FloatingButtonList";
import { caseService } from "@/service/caseService";
import GlobalLoading from "@/components/Loading";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { Proposal } from "@/types/proposalTypes";
import FinancingPlanningReport from "@/reports/financingPlanningReport/FinancingPlanningReport";
import CaseFormModal from "@/components/modals/CaseFormModal";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemDecorator,
  Radio,
  RadioGroup,
  Tab,
  tabClasses,
  TabList,
  Tabs,
  Tooltip,
} from "@mui/joy";
import { MdRestartAlt } from "react-icons/md";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import StatusTag from "@/components/shared/CaseStatusTag";
import { LuBox } from "react-icons/lu";
import { getCaseTitle } from "@/lib/maps";

export default function FinancingPlanning(): JSX.Element {
  const pageContext = usePageContext();
  const { id } = pageContext.routeParams;

  const { propertyData, setMultiplePropertyData } =
    useContext(propertyDataContext);
  const [errors, setErrors] = useState<propertyDataError[]>([]);
  const [report, setReport] = useState<boolean>(false);
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
      const storedData = localStorage.getItem("financingPlanningPropertyData");
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
            "financingPlanningPropertyData",
            JSON.stringify(response.propertyData)
          );
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (!propertyData) return;

    const newErrors: propertyDataError[] = [];

    if (propertyData.finalYear > 35 || propertyData.financingYears > 35) {
      newErrors.push({
        title: "Ano final ou tempo de financiamento inválido.",
        message: "Prazo do financiamento é de no máximo 35 anos",
      });
    }

    setCaseData(calcCaseData(propertyData));

    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
  }, [propertyData]);

  const handleSave = async () => {
    setSaveLoading(true);

    if (!actualCase?.id) return;
    try {
      await caseService.updateCase(actualCase.id, {
        propertyData: propertyData,
        subType: actualCase.subType,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  const handleRestart = () => {
    setNewCase(true);
    setActualCase(undefined);
    navigate("/planejamentofinanciamento");
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
      icon: id ? <FaEdit /> : <FaSave />,
      tooltip: id ? "Editar Case" : "Salvar Case",
    },
    ...(actualCase
      ? [
          {
            onClick: handleSave,
            icon: <FaSave />,
            tooltip: "Salvar Case",
            loading: saveLoading,
          },
        ]
      : []),
  ];

  const subType = actualCase ? actualCase?.subType : newProposalSubType;

  const hideFields =
    subType === "Avançado"
      ? ["inCashFees", "personalBalance", "rentMonthlyYieldRate"]
      : [
          "initialRentMonth",
          "initialRentValue",
          "interestRate",
          "inCashFees",
          "financingYears",
          "ownResource",
          "subsidy",
          "initialDate",
          "outstandingBalance",
          "installmentValueTax",
        ];

  const hideSheets = subType === "Avançado" ? [] : ["appreciation"];

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
      <RestartButton onRestart={handleRestart} />

      {actualCase && <TabsComponent report={report} setReport={setReport} />}
      <HeaderComponent actualCase={actualCase} setActualCase={setActualCase} />

      {report && actualCase ? (
        <FinancingPlanningReport
          onClose={() => setReport(false)}
          propertyData={propertyData}
          caseData={caseData}
          actualCase={actualCase}
        />
      ) : (
        <div className={`${actualCase ? "relative" : "relative mt-5"}`}>
          <div className="flex justify-center">
            <RadioGroup
              aria-label="subType"
              sx={{ width: "600px" }}
              name="subType"
              onChange={(e) => {
                if (actualCase)
                  setActualCase({ ...actualCase, subType: e.target.value });
                else setNewProposalSubType(e.target.value);
              }}
              value={subType}
            >
              <List
                orientation="horizontal"
                className={`!grid !grid-cols-2 !px-4 !max-w-[600px] ${
                  actualCase ? "!mt-4" : ""
                }`}
                sx={{
                  "--List-gap": "0.5rem",
                  "--ListItem-paddingY": "1rem",
                  "--ListItem-radius": "8px",
                  "--ListItemDecorator-size": "32px",
                }}
              >
                {["Simplificado", "Avançado"].map((item, index) => (
                  <ListItem
                    className="!bg-white"
                    variant="outlined"
                    key={item}
                    sx={{ boxShadow: "sm" }}
                  >
                    <ListItemDecorator>
                      {[<LuBox />, <FaCalculator />][index]}
                    </ListItemDecorator>
                    <Radio
                      overlay
                      value={item}
                      label={item}
                      sx={{ flexGrow: 1, flexDirection: "row-reverse" }}
                      slotProps={{
                        action: ({ checked }) => ({
                          sx: (theme) => ({
                            ...(checked && {
                              inset: -1,
                              border: "2px solid",
                              borderColor: theme.vars.palette.primary[500],
                            }),
                          }),
                        }),
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </RadioGroup>
          </div>
          <PropertyDataCard hideSheets={hideSheets} hideFields={hideFields} />
          {subType === "Avançado" && (
            <div className="w-full text-center ">
              {errors.length === 0 ? (
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
              ) : (
                <div
                  className={
                    "grid place-items-center gap-2 mt-5 lg:px-32" +
                    (errors.length % 2 === 0
                      ? " md:grid-cols-2"
                      : " grid-cols-1")
                  }
                >
                  {errors.map((e, index) => (
                    <ErrorAlert
                      key={index}
                      message={e.message}
                      title={e.title}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <FloatingButtonList buttons={buttons} />
        </div>
      )}

      <CaseFormModal
        subType={subType}
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
    </div>
  );
}

interface TabsComponentProps {
  report: boolean;
  setReport: React.Dispatch<React.SetStateAction<boolean>>;
}

const TabsComponent: React.FC<TabsComponentProps> = ({ report, setReport }) => (
  <Tabs
    defaultValue={report ? "report" : "case"}
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
          <span className="font-bold"> Estudo </span>
        </Tab>
      </div>
      <div onClick={() => setReport(true)}>
        <Tab className="!text-primary" value="report">
          <FaFile className="text-sm" />{" "}
          <span className="font-bold">Proposta </span>
        </Tab>
      </div>
    </TabList>
  </Tabs>
);

interface HeaderComponentProps {
  actualCase?: Proposal;
  setActualCase: React.Dispatch<React.SetStateAction<Proposal | undefined>>;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  actualCase,
  setActualCase,
}) => (
  <>
    <div className={actualCase ? "h-[85px]" : "h-[50px]"}>
      <div className="flex justify-center items-center h-full">
        <div className="flex flex-col items-center gap-2">
          {actualCase ? (
            <>
              <h1 className="scroll-m-20 text-xl text-primary text-center">
                {actualCase.name}
                {actualCase.propertyName && " - "}
                {actualCase.propertyName}
              </h1>
              <StatusTag
                status={actualCase.status}
                id={actualCase.id}
                enableEdit
                onChange={(status) =>
                  setActualCase((prev) => prev && { ...prev, status })
                }
              />
            </>
          ) : (
            <h1 className="scroll-m-20 text-xl text-primary text-center mt-2">
              {getCaseTitle("planejamentofinanciamento")}
            </h1>
          )}
        </div>
      </div>
    </div>
    <Divider className="!mt-3" />
  </>
);

interface RestartButtonProps {
  onRestart: () => void;
}

const RestartButton: React.FC<RestartButtonProps> = ({ onRestart }) => (
  <div className="absolute top-[0.6rem] left-[4rem] z-10">
    <Tooltip title="Recomeçar estudo" placement="left-end">
      <Button variant="plain" className="!p-0 !px-1" onClick={onRestart}>
        <MdRestartAlt className="text-xl text-grayText" />
      </Button>
    </Tooltip>
  </div>
);
