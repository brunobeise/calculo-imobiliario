import financiamentoxavista from './financiamentoxavista'
import financingPlanningxavista from "./financingPlanning";

export function getInitialValues(location: string){
    if(location === "/financiamentoxavista") return financiamentoxavista;
      if (location === "/planejamentofinanciamento") return financingPlanningxavista;

      else return financiamentoxavista;
}