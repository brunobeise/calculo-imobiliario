/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import Conclusion from "./Conclusion";
import { ErrorAlert, propertyDataError } from "@/components/errorAlert";
import { caseDataContext } from "./CaseData";
import { calcCaseData } from "./Calculator";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import DetailedTable from "@/pages/financiamento/financingOrCash/DetailedTable";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import { Button, Tab, TabList, Tabs, tabClasses } from "@mui/joy";
import { FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";
import PropertyDataCard from "@/propertyData/ProperyDataCard";

export default function FinancingOrCash() {
  const { propertyData } = useContext(propertyDataContext);
  const [context, setContext] = useState<"financing" | "inCash">("financing");
  const [errors, setErrors] = useState<propertyDataError[]>([]);
  const { caseData, setCaseData } = useContext(caseDataContext);

  useEffect(() => {
    const newErrors: propertyDataError[] = [];
    if (!propertyData) return;

    if (propertyData.finalYear > 35 || propertyData.financingYears > 35) {
      newErrors.push({
        title: "Ano final ou tempo de financiamento inválido.",
        message: "Prazo do financimaneto é de no máximo 35 anos",
      });
    }

    setCaseData("inCash", calcCaseData("inCash", propertyData));
    setCaseData("financing", calcCaseData("financing", propertyData));

    if (JSON.stringify(errors) !== JSON.stringify(newErrors)) {
      setErrors(newErrors);
    }
  }, [propertyData]);

  if (!propertyData) return null;

  return (
    <>
      <PropertyDataCard />
      <div className="w-full text-center">
        <Tabs
          defaultValue={"financing"}
          aria-label="tabs"
          sx={{ bgcolor: "transparent" }}
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
            <div onClick={() => setContext("financing")}>
              <Tab value="financing">Financiamento</Tab>
            </div>
            <div onClick={() => setContext("inCash")}>
              <Tab value="inCash">Á Vista</Tab>
            </div>
          </TabList>
        </Tabs>

        {errors.length === 0 ? (
          <>
            <div className="grid grid-cols-12 px-0 gap-3 justify-center mt-5 mb-5 px-5">
              <Conclusion caseData={caseData} context={context} />

              <TableRentAppreciation
                data={caseData[context].detailedTable.map((i) => i.rentValue)}
                maxHeight={300}
                border
                text="left"
                annualCollection={true}
                title={true}
                colspan={12}
              />
              <TablePropertyAppreciation
                propertyValue={propertyData.propertyValue}
                data={caseData[context].detailedTable.map(
                  (i) => i.propertyValue
                )}
                totalValorization
                maxHeight={300}
                border
                text="left"
                annualCollection={true}
                title={true}
                colspan={12}
              />
              {/* <TabelaRendimento context={context} /> */}
              <DetailedTable detailedTable={caseData[context].detailedTable} />
            </div>
            <div className="fixed bottom-4 right-4 z-10">
              <Link to={"/financiamentoxavista/relatorio"}>
                <Button
                  onClick={() => {
                    localStorage.setItem(
                      "financingOrCashCaseData",
                      JSON.stringify(caseData)
                    );
                    localStorage.setItem(
                      "financingOrCashPropertyData",
                      JSON.stringify(propertyData)
                    );
                  }}
                  className="!rounded-full w-[50px] h-[50px]"
                >
                  <FaFile className="text-4xl" />
                </Button>
              </Link>
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
    </>
  );
}
