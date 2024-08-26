import { Sheet, Table } from "@mui/joy";

import { numeroParaReal } from "@/lib/formatter";

import { useContext } from "react";
import { caseDataContext } from "./CaseData";
import { propertyDataContext } from "@/propertyData/PropertyDataContext";

interface ConclusãoProps {
  context: "financing" | "inCash";
}

export default function Conclusão(props: ConclusãoProps) {
  const { propertyData } = useContext(propertyDataContext);
  const { caseData } = useContext(caseDataContext);

  const {
    finalYear,
  } = propertyData;
  
  return (
    <Sheet
      variant="outlined"
      className="col-span-12 md:col-span-6 lg:col-span-4 order-last lg:order-none text-center p-5"
    >
      <h2 className="text-xl text-center my-2 font-bold">Conclusão</h2>
      <p className="text-xs mb-7 text-center"></p>

      <Sheet>
        <Table
          color="neutral"
          size={"md"}
          sx={{
            "& thead th": {
              textAlign: "center",
            },
            "& tbody td": {
              textAlign: "center",
            },
            "& tbody tr": {
              backgroundColor: "white",
            },
          }}
        >
          <thead>
            <tr>
              <th>Compra do imóvel</th>
              <th>Taxas</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {" "}
                {numeroParaReal(
                  props.context === "financing"
                    ? propertyData.downPayment
                    : propertyData.propertyValue
                )}
              </td>
              <td>
                {numeroParaReal(
                  props.context === "financing"
                    ? propertyData.financingFees
                    : propertyData.inCashFees
                )}
              </td>
              <td>
                {numeroParaReal(
                  props.context === "financing"
                    ? propertyData.financingFees + propertyData.downPayment
                    : propertyData.inCashFees + propertyData.propertyValue
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Sheet>

      <h2 className="text-md text-center my-2 mt-5 font-bold">
        Resultado após {finalYear} anos:
      </h2>

      <Sheet>
        <Table
          className="text-center"
          sx={{
            "& thead th": {
              textAlign: "center",
            },
            "& tbody td": {
              textAlign: "center",
            },
            "& tbody tr": {
              backgroundColor: "white",
            },
          }}
          size="md"
        >
          <thead>
            <tr>
              <th>Valor do imóvel</th>
              <th>Total Aplicação</th>
              <th>Saldo Devedor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>
                {props.context === "financing"
                  ? numeroParaReal(caseData.financing.investedEquityFinal)
                  : numeroParaReal(caseData.inCash.investedEquityFinal)}
              </td>
              <td>
                {props.context === "financing"
                  ? numeroParaReal(propertyData.outstandingBalance)
                  : numeroParaReal(0)}
              </td>
            </tr>
          </tbody>
        </Table>
        <Table
          className="text-center"
          sx={{
            "& thead th": {
              textAlign: "center",
            },
            "& tbody td": {
              textAlign: "center",
            },
            "& tbody tr": {
              backgroundColor: "white",
            },
          }}
          size="md"
        >
          <thead>
            <tr>
              <th>Invest. Excedente</th>
              <th>Patrimônio Final</th>

              <th>Lucro na operação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {props.context === "financing"
                  ? numeroParaReal(caseData.financing.totalRentalShortfall)
                  : numeroParaReal(0)}
              </td>

              <td className="text-black font-bold">
                {props.context === "financing"
                  ? numeroParaReal(caseData.financing.totalFinalEquity)
                  : numeroParaReal(caseData.inCash.totalFinalEquity)}
              </td>

              <td>
                {props.context === "financing"
                  ? numeroParaReal(caseData.financing.totalProfit)
                  : numeroParaReal(caseData.inCash.totalProfit)}
                <p>
                  {props.context === "financing"
                    ? "(" +
                      caseData.financing.totalProfitPercent.toFixed(2) +
                      "%)"
                    : "(" +
                      caseData.inCash.totalProfitPercent.toFixed(2) +
                      "%)"}
                </p>
              </td>
            </tr>
          </tbody>
        </Table>
        <p className="text-sm mt-5">*Imposto sobre ganho de capital: <span className="font-bold">{numeroParaReal(caseData[props.context].capitalGainsTax)}</span></p>
      </Sheet>
    </Sheet>
  );
}
