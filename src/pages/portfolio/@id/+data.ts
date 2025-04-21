
import { portfolioService } from "@/service/portfolioService";
import { PageContext } from "vike/types";

export { data };

async function data(pageContext: PageContext) {
  const proposalData = await portfolioService.getSharedPortfolio(
    pageContext.routeParams.id
  );

  return proposalData;
}
