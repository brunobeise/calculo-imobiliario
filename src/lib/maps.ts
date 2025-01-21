export const CaseStudyTypeLinkMap = {
  financingPlanning: "/planejamentofinanciamento",
  directFinancing: "/parcelamentodireto",
};

export const CaseStudyLinkTypeMap = {
  "/planejamentofinanciamento": "financingPlanning",
  "/parcelamentodireto": "directFinancing",
};

export const CaseStudyTypeMap = {
  financingPlanning: "Planejamento de Financiamento",
  planejamentofinanciamento: "Planejamento de Financiamento",
  directFinancing: "Parcelamento Direto",
  parcelamentodireto: "Parcelamento Direto",
};

export const badgeStatusMap = {
  Rascunho: "default",
  "Em Análise": "warning",
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

export function getCaseTypeByLink(Key?: string) {
  return (
    CaseStudyLinkTypeMap[Key as keyof typeof CaseStudyLinkTypeMap] ||
    "financingPlanning"
  );
}
