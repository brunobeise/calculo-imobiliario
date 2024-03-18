import financiamentoxavista from './financiamentoxavista'
import financiamentoisoaldoxavista from "./financiamentoisoaldoxavista";

export function getInitialValues(location: string){
    if(location === "/financiamentoxavista") return financiamentoxavista;
      if (location === "/financiamentoisoladoxavista") return financiamentoisoaldoxavista;

      else return financiamentoxavista;
}