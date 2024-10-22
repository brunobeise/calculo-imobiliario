import { ReactNode } from "react";
import "../index.css";
import "@/assets/fonts/font.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  ArcElement
);
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { CssVarsProvider } from "@mui/joy";
import theme from "@/theme";
import { AuthProvider } from "@/auth";
import { PropertyDataProvider } from "@/propertyData/PropertyDataContext";
import { Bounce, ToastContainer } from "react-toastify";
import DrawerMenu from "@/components/DrawerMenu";
import Header from "@/components/header";
import { FinancingPlanningCaseDataProvider } from "./planejamentofinanciamento/@id/CaseData";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

export { Layout };

function Layout({ children }: { children: ReactNode }) {
  return (
    <CssVarsProvider theme={theme}>
      <AuthProvider>
        <PropertyDataProvider>
          <Provider store={store}>
            <ToastContainer
              position="top-center"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
              transition={Bounce}
            />
            <Header />
            <DrawerMenu />
            <FinancingPlanningCaseDataProvider>
              {children}
            </FinancingPlanningCaseDataProvider>
          </Provider>{" "}
        </PropertyDataProvider>
      </AuthProvider>
    </CssVarsProvider>
  );
}
