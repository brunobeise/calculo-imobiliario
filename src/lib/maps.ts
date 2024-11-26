export const CaseStudyTypeLinkMap = {
  financingPlanning: "/planejamentofinanciamento",
};

export const CaseStudyTypeMap = {
  financingPlanning: "Planejamento de Financiamento",
  planejamentofinanciamento: "Planejamento de Financiamento",
};

export const badgeStatusMap = {
  Rascunho: "default",
  "Em análise": "warning",
  Enviada: "info",
  Aceita: "success",
  Recusada: "danger",
} as const;

export function getBadgeType(status: string) {
  return badgeStatusMap[status as keyof typeof badgeStatusMap] || "info";
}

export function getCaseTitle(Key: string) {
  return (
    CaseStudyTypeMap[Key as keyof typeof CaseStudyTypeMap] ||
    "planejamentofinanciamento"
  );
}

export function getCaseLink(Key?: string) {
  return (
    CaseStudyTypeLinkMap[Key as keyof typeof CaseStudyTypeLinkMap] ||
    "financingPlanning"
  );
}
