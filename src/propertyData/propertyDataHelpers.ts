import { Proposal } from "@/types/proposalTypes";
import { PropertyData } from "@/propertyData/PropertyDataContext";

export function handleSetProposalPropertyData<T extends keyof PropertyData>(
  proposal: Proposal,
  field: T,
  value: PropertyData[T]
): Proposal {
  return {
    ...proposal,
    propertyData: {
      ...proposal.propertyData,
      [field]: value,
    },
  };
}

export function handleSetMultipleProposalPropertyData(
  proposal: Proposal,
  values: Partial<PropertyData>
): Proposal {
  return {
    ...proposal,
    propertyData: {
      ...proposal.propertyData,
      ...values,
    },
  };
}
