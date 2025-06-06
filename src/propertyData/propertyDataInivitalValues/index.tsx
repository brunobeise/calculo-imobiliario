import financingPlanning from "./financingPlanning";
import directFinancing from "./directFinancing";
import { ProposalTypes } from "@/types/proposalTypes";

export function getInitialValues(type: string) {
  if (type === ProposalTypes.FinancamentoBancário) return financingPlanning;
  if (type === ProposalTypes.ParcelamentoDireto) return directFinancing;
  else return financingPlanning;
}
