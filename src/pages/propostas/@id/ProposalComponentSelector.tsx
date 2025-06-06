import FinancingPlanningConclusion from "./conclusions/FinancingPlanningConclusion";
import DirectFinancingConclusion from "./conclusions/DirectFinancingConclusion";

import FinancingPlanningDetailedTableComponent from "./detailedTables/FinancingPlanningDetailedTable";
import DirectFinancingDetailedTableComponent from "./detailedTables/DirectFinancingDetailedTable";

import { calcCaseData as FinancingPlanningCalculator } from "./calculators/FinancingPlanningCalculator";

import { calcCaseData as DirectFinancingCalculator } from "./calculators/DirectFinancingCalculator";

import { PropertyData } from "@/propertyData/PropertyDataContext";
import { ProposalTypes } from "@/types/proposalTypes";
import TableRentAppreciation from "@/components/tables/TableRentAppreciation";
import TablePropertyAppreciation from "@/components/tables/TablePropertyAppreciation";

type SelectorProps = {
  type: string;
  propertyData: PropertyData;
};

export function getComponentsBySubType({ type, propertyData }: SelectorProps) {
  switch (type) {
    case ProposalTypes.FinancamentoBancário: {
      const caseData = FinancingPlanningCalculator(propertyData);

      return {
        caseData,
        Conclusion: (
          <FinancingPlanningConclusion
            propertyData={propertyData}
            caseData={caseData}
          />
        ),
        DetailedTable: (
          <FinancingPlanningDetailedTableComponent
            propertyData={propertyData}
            detailedTable={caseData.detailedTable}
          />
        ),
        TableRentAppreciation: (
          <TableRentAppreciation
            data={caseData.detailedTable.map((i) => i.rentValue)}
            maxHeight={300}
            border
            text="left"
            annualCollection={true}
            title={true}
            colspan={12}
          />
        ),
        TablePropertyAppreciation: (
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
        ),
      };
    }

    case ProposalTypes.ParcelamentoDireto: {
      const caseData = DirectFinancingCalculator(propertyData);

      return {
        caseData,
        Conclusion: (
          <DirectFinancingConclusion
            caseData={caseData}
            finalYear={propertyData.finalYear}
          />
        ),
        DetailedTable: (
          <DirectFinancingDetailedTableComponent
            detailedTable={caseData.detailedTable}
            propertyData={propertyData}
          />
        ),
        TableRentAppreciation: (
          <TableRentAppreciation
            data={caseData.detailedTable.map((i) => i.rentValue)}
            maxHeight={300}
            border
            text="left"
            annualCollection={true}
            title={true}
            colspan={12}
          />
        ),
        TablePropertyAppreciation: (
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
        ),
      };
    }

    default:
      throw new Error(`type desconhecido: ${type}`);
  }
}
