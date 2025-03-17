import { useEffect, useState, useContext } from "react";
import { Button } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { fetchCases, fetchRealEstateCases } from "@/store/caseReducer";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import PropertyDataNewCaseForm from "@/propertyData/propertyDataInivitalValues/propertyDataNewCaseForm/PropertyDataNewCaseForm";
import { AppDispatch, RootState } from "@/store/store";
import NewCaseManualOptions from "./NewCaseManualOptions";
import NewCaseOptions from "./NewCaseOptions";
import { ExistingCaseOptions } from "./ExistingCaseOptions";
import RealEstateCases from "./RealEstateCases";
import MyCases from "./MyCases";
import { FaArrowLeft } from "react-icons/fa";
import SubTypeOptions from "./SubTypeOptions";
import { getInitialValues } from "@/propertyData/propertyDataInivitalValues";
import { usePageContext } from "vike-react/usePageContext";
import { getCaseTypeByLink } from "@/lib/maps";

interface NewCaseProps {
  setNewCase: (v: boolean) => void;
  setSubType: (v: string) => void;
}

export type NewCaseContext =
  | "new"
  | "exists"
  | "newAdvancedCase"
  | "myCases"
  | "realEstateCases"
  | "subType"
  | "template"
  | "manual"
  | "newSimplificatedCase";

export default function NewCase(props: NewCaseProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [context, setContext] = useState<NewCaseContext>();

  const { setMultiplePropertyData } = useContext(propertyDataContext);
  const url = usePageContext().urlPathname;

  const [search, setSearch] = useState("");

  const { myCases, realEstateCases, loading, realEstateCasesLastPage } =
    useSelector((state: RootState) => ({
      myCases: state.proposals.myCases,
      realEstateCases: state.proposals.realEstateCases,
      loading:
        state.proposals.myCasesLoading ||
        state.proposals.realEstateCasesLoading,
      realEstateCasesLastPage: state.proposals.realEstateCasesLastPage,
    }));

  useEffect(() => {
    if (context === "myCases")
      dispatch(fetchCases({ type: getCaseTypeByLink(url), search: search }));
    if (context === "realEstateCases")
      dispatch(fetchRealEstateCases(undefined));
  }, [context, dispatch, search, url]);

  const hasLastCase = () => {
    const storedData = localStorage.getItem("financingPlanningPropertyData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData && typeof parsedData === "object") {
          return true;
        }
      } catch (error) {
        return false;
      }
    } else return false;
  };

  const handleBack = () => {
    if (context === "myCases") setContext("exists");
    else setContext(undefined);
  };

  return (
    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] ">
      <h2 className="text-primary font-bold text-center text-xl mb-5 ">
        {!context && " Iniciar estudo"}
        {context === "new" && "Como deseja começar o estudo?"}
        {context === "exists" && "Continuar estudo"}
        {context === "realEstateCases" && "Estudos Compartilhados"}
        {context === "myCases" && "Meus estudos"}
        {context === "template" && "Qual tipo do estudo?"}
        {context === "manual" && "Qual tipo do estudo?"}
      </h2>

      {!context && <NewCaseOptions setContext={setContext} />}

      {context === "new" && <NewCaseManualOptions setContext={setContext} />}

      {context === "exists" && (
        <ExistingCaseOptions
          setContext={setContext}
          setMultiplePropertyData={setMultiplePropertyData}
          setNewCase={props.setNewCase}
          hasLastCase={!!hasLastCase()}
        />
      )}

      {(context === "newAdvancedCase" ||
        context === "newSimplificatedCase") && (
        <PropertyDataNewCaseForm
          subType={context === "newAdvancedCase" ? "Avançado" : "Simplificado"}
          finish={(p) => {
            if (p) {
              setMultiplePropertyData({
                ...getInitialValues(location.pathname),
                ...p,
                subsidy: p.subsidy || 0,
                initialRentValue: p.initialRentValue || 0,
                rentAppreciationRate: p.rentAppreciationRate || 0,
                annualYieldRate: p.annualYieldRate || 0,
              });
              props.setNewCase(false);
            } else {
              props.setNewCase(true);
              setContext(undefined);
            }
          }}
        />
      )}

      {context === "realEstateCases" && (
        <RealEstateCases
          totalPages={realEstateCasesLastPage || 0}
          realEstateCases={realEstateCases}
          loading={loading}
          setMultiplePropertyData={setMultiplePropertyData}
          setNewCase={props.setNewCase}
        />
      )}

      {context === "myCases" && (
        <MyCases
          onSearch={(v) => setSearch(v)}
          myCases={myCases}
          loading={loading}
        />
      )}

      {(context === "template" || context === "manual") && (
        <SubTypeOptions
          onSelect={(v: string) => {
            if (context === "template") {
              setMultiplePropertyData(getInitialValues(location.pathname));
              props.setSubType(v);
              props.setNewCase(false);
            } else if (context === "manual") {
              v === "Simplificado"
                ? setContext("newSimplificatedCase")
                : setContext("newAdvancedCase");
            }
          }}
        />
      )}

      {context &&
        context !== "newSimplificatedCase" &&
        context !== "newAdvancedCase" && (
          <div className="w-full flex justify-center mt-5">
            <Button
              startDecorator={<FaArrowLeft />}
              onClick={handleBack}
              variant="plain"
            >
              Voltar
            </Button>
          </div>
        )}
    </div>
  );
}
