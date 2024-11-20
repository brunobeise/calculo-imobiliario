import { Card } from "@mui/joy";
import ContextSelectorButton from "../shared/ContextSelectorButton";
import { FaFile } from "react-icons/fa";
import { toBRL } from "@/lib/formatter";
import { BsFillHouseFill } from "react-icons/bs";
import dayjs from "dayjs";
import { Spinner } from "../Loading";
import { CaseStudyTypeLinkMap } from "@/lib/maps";
import { Proposal } from "@/types/proposalTypes";

interface MyCasesProps {
  myCases: Proposal[];
  loading: boolean;
}

export default function MyCases({ myCases, loading }: MyCasesProps) {
  return (
    <Card className="w-[500px] h-[400px] shadow-lg overflow-y-auto">
      {myCases.length > 0 ? (
        myCases.map((c) => (
          <a
            key={c.id}
            href={
              CaseStudyTypeLinkMap[
                c.type as keyof typeof CaseStudyTypeLinkMap
              ] +
              "/" +
              c.id
            }
          >
            <ContextSelectorButton
              icon={<FaFile />}
              title={c.name}
              extra={
                <div className="flex flex-col text-sm ms-5">
                  <p>
                    <strong className="font-bold">Valor do imóvel:</strong>{" "}
                    {toBRL(c.propertyData.propertyValue)}
                  </p>

                  <p>
                    <strong className="font-bold">Entrada:</strong>{" "}
                    {toBRL(c.propertyData.downPayment)}
                  </p>
                  <p>
                    <strong className="font-bold">Parcelas:</strong>{" "}
                    {toBRL(c.propertyData.installmentValue)}
                  </p>
                </div>
              }
              desc={
                <div className="flex flex-col gap-1">
                  {c.propertyName && (
                    <span className="flex gap-1 items-center">
                      <BsFillHouseFill />
                      {c.propertyName}
                    </span>
                  )}

                  <span> {dayjs(c.createdAt).format("DD/MM/YYYY")}</span>
                </div>
              }
            />
          </a>
        ))
      ) : !loading ? (
        <p className="text-center font-bold mt-5">
          Você não tem nenhum estudo :(
        </p>
      ) : (
        <Spinner />
      )}
    </Card>
  );
}
