import financingPlanning from "./financingPlanning";
import directFinancing from "./directFinancing"

export function getInitialValues(location: string) {
  if (location === "/planejamentofinanciamento") return financingPlanning;
   if (location === "/parcelamentodireto") return directFinancing;
   else return financingPlanning;
}
