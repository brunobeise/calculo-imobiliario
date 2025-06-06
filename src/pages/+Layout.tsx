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
  BarElement,
  BubbleController,
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
  annotationPlugin,
  BarElement,
  BubbleController
);
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { CssVarsProvider } from "@mui/joy";
import theme from "@/theme";
import { AuthProvider } from "@/auth";
import { PropertyDataProvider } from "@/propertyData/PropertyDataContext";
import { Bounce, ToastContainer } from "react-toastify";
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
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import WebFont from "webfontloader";
import MobileBottomMenu from "@/components/menu/MobileMenu";

export { Layout };

function Layout({ children }: { children: ReactNode }) {
  const pageContext = usePageContext();
  const isCaseMenuRoute =
    pageContext.urlPathname.includes("/propostas/") ||
    pageContext.urlPathname.includes("cenarios") ||
    pageContext.urlPathname.includes("onboarding") ||
    pageContext.urlPathname === "/";

  WebFont.load({
    google: {
      families: [
        "Poppins",
        "Roboto",
        "Montserrat",
        "Playfair Display",
        "Merriweather",
        "Lora",
        "Raleway",
        "Libre Baskerville",
        "Bebas Neue",
        "Great Vibes",
        "DM Serif Display",
        "Cinzel",
        "Cormorant Garamond",
        "Abril Fatface",
        "Bodoni Moda",
        "Oswald",
        "Dancing Script",
        "Allura",
        "Pacifico",
        "Satisfy",
        "Parisienne",
        "Yeseva One",
        "Alex Brush",
        "Italianno",
        "Courgette",
      ],
    },
  });

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
              <DndProvider backend={HTML5Backend}>
                <MenuProvider>
                  <div className="flex">
                    {<DrawerMenu isCaseMenu={isCaseMenuRoute} />}
                    <MobileBottomMenu />
                    <div
                      className={`flex flex-col w-full ${
                        !isCaseMenuRoute &&
                        !pageContext.urlPathname.includes("/proposta/") &&
                        !pageContext.urlPathname.includes("/portfolio/")
                          ? "pb-10 md:pb-0 md:ms-[210px]"
                          : ""
                      }`}
                    >
                      {children}
                    </div>
                  </div>
                </MenuProvider>
              </DndProvider>
            </PropertyDataProvider>
          </WebSocketProvider>
        </AuthProvider>
      </Provider>
    </CssVarsProvider>
  );
}
