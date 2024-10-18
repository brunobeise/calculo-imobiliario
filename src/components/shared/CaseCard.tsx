import Card from "@mui/joy/Card";
import Button from "@mui/joy/Button";
import PropertyDataDisplay from "./PropertyDataDisplay";
import { CaseStudy } from "@/service/caseService";
import { CardContent, Typography } from "@mui/joy";
import dayjs from "dayjs";
import { CaseStudyTypeMap } from "@/pages/MyCases";
import { Link } from "react-router-dom";

export const CaseStudyTypeLinkMap = {
  financingPlanning: "/planejamentofinanciamento",
};

const CaseCard = ({ caseStudy }: { caseStudy: CaseStudy }) => {
  return (
    <Card variant="outlined" className="w-[470px]">
      <div>
        <div className="flex items-start mb-2 h-[60px] overflow-y-hidden">
          <Typography level="h4">{caseStudy.name}</Typography>
        </div>
      </div>
      <CardContent>
        <div className="mb-2">
          <Typography level="body-md">
            <strong>Tipo:</strong>{" "}
            {CaseStudyTypeMap[caseStudy.type as keyof typeof CaseStudyTypeMap]}
          </Typography>
          <Typography level="body-md">
            <strong>Criado em:</strong>{" "}
            {dayjs(caseStudy.createdAt).format("MM/DD/YYYY")}
          </Typography>
        </div>
        <PropertyDataDisplay propertyData={caseStudy.propertyData} />
        <Link
          to={
            CaseStudyTypeLinkMap[
              caseStudy.type as keyof typeof CaseStudyTypeLinkMap
            ] + "/" + caseStudy.id
          }
        >
          <div className="mt-4 flex justify-end">
            <Button size="sm">Continuar Estudo</Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default CaseCard;
