import financingPlanning from "./financingPlanning";

export function getInitialValues(location: string) {
  if (location === "/planejamentofinanciamento") return financingPlanning;
  else return financingPlanning;
}
