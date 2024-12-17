import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
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
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode></React.StrictMode>
);
