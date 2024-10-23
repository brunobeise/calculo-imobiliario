import { caseService } from "@/service/caseService";
import { PageContext } from "vike/types";

export { data };

async function data(pageContext: PageContext) {
  const proposalData = await caseService.getCaseToProposal(
    pageContext.routeParams.id
  );

  return proposalData;
}
