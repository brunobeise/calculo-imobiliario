import { caseService } from "@/service/caseService";

export async function onBeforePrerenderStart() {
  const cases = await caseService.getAllProposals();
  return cases?.map((caseItem) => ({
    url: `/proposta/${caseItem}`,
  }));
}
