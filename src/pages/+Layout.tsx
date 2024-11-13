import { ReactNode } from "react";
import "../index.css";
import "@/assets/fonts/font.css";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin from "chartjs-plugin-annotation";
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
  ArcElement,
  annotationPlugin
);
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { CssVarsProvider } from "@mui/joy";
import theme from "@/theme";
import { AuthProvider } from "@/auth";
import { PropertyDataProvider } from "@/propertyData/PropertyDataContext";
import { Bounce, ToastContainer } from "react-toastify";
import Header from "@/components/header";
import { FinancingPlanningCaseDataProvider } from "./planejamentofinanciamento/@id/CaseData";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");
import "react-toastify/dist/ReactToastify.css";
import { MenuProvider } from "@/components/menu/MenuContext";
import DrawerMenu from "@/components/menu/DrawerMenu";
import { usePageContext } from "vike-react/usePageContext";

export { Layout };

function Layout({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const isCaseMenuRoute =
    pageContext.urlPathname.includes("planejamentofinanciamento") ||
    pageContext.urlPathname === "/";

  return (
    <CssVarsProvider theme={theme}>
      <AuthProvider>
        <PropertyDataProvider>
          <Provider store={store}>
            <FinancingPlanningCaseDataProvider>
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
              <MenuProvider>
                <div className="flex">
                  {<DrawerMenu isCaseMenu={isCaseMenuRoute} />}
                  <div
                    className={`flex flex-col w-full ${
                      !isCaseMenuRoute &&
                      !pageContext.urlPathname.includes("/proposta")
                        ? "ms-64"
                        : ""
                    }`}
                  >
                    <Header />
                    {children}
                  </div>
                </div>
              </MenuProvider>
            </FinancingPlanningCaseDataProvider>
          </Provider>
        </PropertyDataProvider>
      </AuthProvider>
    </CssVarsProvider>
  );
}
