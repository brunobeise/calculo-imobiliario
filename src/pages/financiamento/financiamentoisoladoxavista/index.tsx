/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";
import Conclusão from "./Conclusão";
import { ErrorAlert, propertyDataError } from "@/components/errorAlert";
import { caseDataContext } from "./Context";
import { calcCaseData } from "./Calculator";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";
import { Button, Tab, TabList, Tabs, tabClasses } from "@mui/joy";
import { FaFile } from "react-icons/fa";
import { Link } from "react-router-dom";
import DetailedTable from "./DetailedTable";

export default function IsolatedFinancingOrCash() {
  const { propertyData } = useContext(propertyDataContext);
  const [context, setContext] = useState<"financing" | "inCash">("financing");
  const [errors, setErrors] = useState<propertyDataError[]>([]);
  const { caseData, setCaseData } = useContext(caseDataContext);

  useEffect(() => {
    const newErrors: propertyDataError[] = [];

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


  return (
    <>
      <div className="w-full text-center">
        <Tabs
          defaultValue={"financing"}
          aria-label="tabs"
          sx={{ bgcolor: "transparent" }}
        >
          <TabList
            onChange={(e) => console.log(e?.target)}
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
            <div className="grid grid-cols-12 px-0 gap-3 justify-center mt-5 mb-5">
              <Conclusão context={context} />

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
              <DetailedTable detailedTable={caseData[context].detailedTable} />
            </div>
            <Link to={"/financiamentoisoladoxavista/relatorio"}>
              <Button
                startDecorator={<FaFile />}
                onClick={() => {
                    localStorage.setItem(
                      "isolatedFinancingOrInCashCaseData",
                      JSON.stringify(caseData)
                    );
                    localStorage.setItem(
                      "isolatedFinancingOrInCashPropertyData",
                      JSON.stringify(propertyData)
                    );
                }
                
                }
                className="my-5"
              >
                Gerar Relatório Completo
              </Button>
            </Link>
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
