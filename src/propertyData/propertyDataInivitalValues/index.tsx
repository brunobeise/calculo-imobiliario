import financiamentoxavista from "./financiamentoxavista";
import financingPlanning from "./financingPlanning";

export function getInitialValues(location: string) {
  if (location === "/financiamentoxavista") return financiamentoxavista;
  if (location === "/planejamentofinanciamento") return financingPlanning;
  else return financingPlanning;
}
