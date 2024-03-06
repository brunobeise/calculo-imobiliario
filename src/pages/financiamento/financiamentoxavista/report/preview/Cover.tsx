import { useContext } from "react";
import { FinanceOrCashReportContext } from "../Context";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { numeroParaReal } from "@/lib/formatter";
import { FinanceOrCashData } from "@/pages/financiamento/financiamentoxavista/Context";

dayjs.locale("pt-br");

export default function Cover() {
  const { financeOrCashReportState } = useContext(FinanceOrCashReportContext);

  const {
    propertyPicture,
    propertyName,
    title,
    companyLogo1,
    createdAt,
    presentation,
    agentCRECI,
    agentName,
    calculation,
    companyLogo2,
    coverType,
  } = financeOrCashReportState;

  const caseData: FinanceOrCashData = JSON.parse(
    localStorage.getItem("financingOrInCashCaseData") || ""
  );

  return (
    <div className="text-center relative min-h-[297mm]">
      {title.active && (
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-primary my-5">
          {title.content}
        </h1>
      )}

      {propertyPicture.active && coverType === 1 && (
        <div className="relative h-[500px] overflow-hidden">
          <img
            className="absolute w-full top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%] shadow-lg"
            src={propertyPicture.content}
          />
          <img
            className="absolute top-[1rem] right-[1rem] w-24"
            src={companyLogo1.content}
          />
          {propertyName.active && (
            <div
              className={"absolute top-[1rem] left-[1rem] w-[10rem] text-left"}
            >
              <h1
                style={{ color: propertyName.color }}
                className="scroll-m-20 text-3xl font-extrabold tracking-tight "
              >
                {propertyName.content}
              </h1>
            </div>
          )}
        </div>
      )}

      {presentation.active && (
        <p className=" text-justify px-10 leading-7 my-10">
          {presentation.content}
        </p>
      )}

      {calculation.active && (
        <div className="grid grid-cols-2 my-10">
          <div>
            <p className="font-bold mb-2">Financiamento:</p>
            <p> Lucro na operação: </p>
            <p>
              <span className="font-bold">
                {numeroParaReal(caseData.financing.totalProfit)}
              </span>

              {" (" + caseData.financing.totalProfitPercent.toFixed(2) + "%)"}
            </p>
          </div>
          <div>
            <p className="font-bold mb-2">À Vista:</p>
            <p> Lucro na operação: </p>
            <p>
              <span className="font-bold">
                {numeroParaReal(caseData.inCash.totalProfit)}
              </span>

              {" (" + caseData.inCash.totalProfitPercent.toFixed(2) + "%)"}
            </p>
          </div>
        </div>
      )}
      {agentName.active && agentCRECI.active && (
        <>
          <div className="grid grid-cols-3 flex justify-center items-center">
            <p>
              Corretor: <span className="font-bold"> {agentName.content} </span>{" "}
            </p>
            <p>
              CRECI: <span className="font-bold"> {agentCRECI.content} </span>{" "}
            </p>
            {createdAt.active && (
              <p>{dayjs(createdAt.content).format("DD [de] MMMM [de] YYYY")}</p>
            )}
          </div>
        </>
      )}
      <img
        className="w-[20%] ms-[50%] translate-x-[-50%] mt-20 absolute bottom-[5rem]"
        src={companyLogo2.content}
      />
    </div>
  );
}
