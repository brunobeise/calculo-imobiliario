import { Proposal } from "./proposalTypes";

export interface Session {
  id: number;
  sessionTime: number;
  caseId: string;
  [key: `page${number}TimeVisible`]: number | null;
  createdAt: Date;
  case: Proposal;
  isNew: boolean;
  viewerName?: string;
}

export interface PortfolioSession {
  id: string;
  sessionTime: number;
  portfolioId: string;
  [key: `item${number}TimeVisible`]: number | null;
  [key: `item${number}Name`]: string;
  createdAt: Date;
  isNew: boolean;
  viewerName?: string;
}


