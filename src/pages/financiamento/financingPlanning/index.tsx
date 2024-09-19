/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import {
  PropertyData,
  propertyDataContext,
} from "@/propertyData/PropertyDataContext";
import { ErrorAlert, propertyDataError } from "@/components/errorAlert";
import { caseDataContext } from "./CaseData";
import { calcCaseData } from "./Calculator";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import { Button } from "@mui/joy";
import { FaFile } from "react-icons/fa";
import { Link, useSearchParams } from "react-router-dom";
import DetailedTable from "./DetailedTable";
import Conclusion from "./Conclusion";
import PropertyDataCard from "@/propertyData/ProperyDataCard";

export default function FinancingPlanning() {
  const { propertyData, setMultiplePropertyData } =
    useContext(propertyDataContext);
  const [errors, setErrors] = useState<propertyDataError[]>([]);
  const { caseData, setCaseData } = useContext(caseDataContext);

  const [searchParams] = useSearchParams();
  const useSaveData = searchParams.get("useSaveData") === "true";

  useEffect(() => {
    const newErrors: propertyDataError[] = [];

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

  useEffect(() => {
    if (useSaveData && typeof window !== "undefined") {
      const storedData = localStorage.getItem("financingPlanningPropertyData");
      if (storedData) {
        try {
          const propertyData: PropertyData = JSON.parse(storedData);
          setMultiplePropertyData(propertyData);
        } catch (error) {
          console.error("Erro ao analisar os dados do localStorage:", error);
        }
      } else {
        console.warn(
          "Nenhum dado encontrado no localStorage para 'financingPlanningPropertyData'."
        );
      }
    }
  }, []);
  return (
    <div className="relative">
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
      <div className="fixed bottom-4 right-4 z-10">
        <Link to={"/planejamentofinanciamento/relatorio"}>
          <Button
            className="!rounded-full w-[50px] h-[50px]"
            onClick={() => {
              localStorage.setItem(
                "financingPlanningCaseData",
                JSON.stringify(caseData)
              );
              localStorage.setItem(
                "financingPlanningPropertyData",
                JSON.stringify(propertyData)
              );
            }}
          >
            <FaFile className="text-4xl" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
