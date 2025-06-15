import { Building } from "./buildingTypes";
import { Proposal } from "./proposalTypes";
import { PortfolioSession } from "./sessionTypes";
import { User } from "./userTypes";

export interface Portfolio {
  id: string;
  name: string;
  description?: string;
  clientName?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: PortfolioItem[];
  user?: User;
  sessions: PortfolioSession[];
  hasNewSession?: boolean;
  requestName: boolean;
  title?: string;
  link?: string;
  messageText?: string;
  mainPhoto?: string;
  itemNames: string[];

  useThumbnailNames: boolean;
  useCustomNames: boolean;
  useShowNamePage: boolean;
  useInfiniteScroll: boolean;

  _count?: {
    sessions: number;
  };
}

export interface PortfolioItem {
  id: string;
  portfolioId: string;
  case?: Proposal;
  caseId?: string;
  building?: Building;
  buildingId?: string;
  addedAt: string;
}

export interface CreatePortfolio {
  name: string;
  description?: string;
  clientName?: string;
  items: PortfolioItem[];
  requestName: boolean;
  mainPhoto: string;
}
