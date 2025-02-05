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
import { WebSocketProvider } from "@/Socket";
import { DirectFinancingCaseDataProvider } from "./parcelamentodireto/@id/CaseData";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Clarity from "@microsoft/clarity";

export { Layout };

function Layout({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const isCaseMenuRoute =
    pageContext.urlPathname.includes("planejamentofinanciamento") ||
    pageContext.urlPathname.includes("parcelamentodireto") ||
    pageContext.urlPathname.includes("cenarios") ||
    pageContext.urlPathname === "/";

  // Clarity.init("q41oivjif8");

  if (typeof global === "undefined") {
    window.global = window;
  }

  return (
    <CssVarsProvider theme={theme}>
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
      <Provider store={store}>
        <AuthProvider>
          <WebSocketProvider>
            <PropertyDataProvider>
              <FinancingPlanningCaseDataProvider>
                <DirectFinancingCaseDataProvider>
                  <DndProvider backend={HTML5Backend}>
                    <MenuProvider>
                      <div className="flex">
                        {<DrawerMenu isCaseMenu={isCaseMenuRoute} />}
                        <div
                          className={`flex flex-col w-full ${
                            !isCaseMenuRoute &&
                            !pageContext.urlPathname.includes("/proposta/")
                              ? "ms-64"
                              : ""
                          }`}
                        >
                          {children}
                        </div>
                      </div>
                    </MenuProvider>
                  </DndProvider>
                </DirectFinancingCaseDataProvider>
              </FinancingPlanningCaseDataProvider>
            </PropertyDataProvider>
          </WebSocketProvider>
        </AuthProvider>
      </Provider>
    </CssVarsProvider>
  );
}
