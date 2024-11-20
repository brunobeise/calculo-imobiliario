import { Proposal } from "./proposalTypes";

export interface Session {
  id: number;
  sessionTime: number;
  caseId: string;
  [key: `page${number}TimeVisible`]: number | null;
  createdAt: Date;
  case: Proposal;
  isNew: boolean;
}
