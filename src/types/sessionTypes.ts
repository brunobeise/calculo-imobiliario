import { CaseStudy } from "./caseTypes";

export interface Session {
  id: number;
  sessionTime: number;
  caseId: string;
  [key: `page${number}TimeVisible`]: number | null;
  createdAt: Date;
  case: CaseStudy;
}
