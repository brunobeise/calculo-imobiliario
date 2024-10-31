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

interface NewCaseProps {
  setNewCase: (v: boolean) => void;
}

export default function NewCase(props: NewCaseProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [context, setContext] = useState<
    "new" | "exists" | "newCase" | "myCases" | "realEstateCases"
  >();

  const { setMultiplePropertyData } = useContext(propertyDataContext);

  const { myCases, realEstateCases, loading } = useSelector(
    (state: RootState) => ({
      myCases: state.cases.myCases,
      realEstateCases: state.cases.realEstateCases,
      loading: state.cases.loading,
    })
  );

  useEffect(() => {
    if (context === "myCases") dispatch(fetchCases());
    if (context === "realEstateCases") dispatch(fetchRealEstateCases());
  }, [context, dispatch]);

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
        {context === "myCases" && "Meus Estudos"}
        {context === "realEstateCases" && "Estudos Compartilhados"}
      </h2>

      {!context && <NewCaseOptions setContext={setContext} />}

      {context === "new" && (
        <NewCaseManualOptions
          setContext={setContext}
          setMultiplePropertyData={setMultiplePropertyData}
          setNewCase={props.setNewCase}
        />
      )}

      {context === "exists" && (
        <ExistingCaseOptions
          setContext={setContext}
          setMultiplePropertyData={setMultiplePropertyData}
          setNewCase={props.setNewCase}
          hasLastCase={!!hasLastCase()}
        />
      )}

      {context === "newCase" && (
        <PropertyDataNewCaseForm
          finish={(p) => {
            if (p) {
              setMultiplePropertyData({
                ...p,
                subsidy: p.subsidy || 0,
                initialRentValue: p.initialRentValue || 0,
                rentAppreciationRate: p.rentAppreciationRate || 0,
                monthlyYieldRate: p.monthlyYieldRate || 0,
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
          realEstateCases={realEstateCases}
          loading={loading}
          setMultiplePropertyData={setMultiplePropertyData}
          setNewCase={props.setNewCase}
        />
      )}

      {context === "myCases" && (
        <MyCases
          myCases={myCases}
          loading={loading}
          setNewCase={props.setNewCase}
        />
      )}

      {context && context !== "newCase" && (
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

// NewCaseManualOptions Component

// NewCaseOptions Component

// ExistingCaseOptions Component

// MyCases Component

// RealEstateCases Component
