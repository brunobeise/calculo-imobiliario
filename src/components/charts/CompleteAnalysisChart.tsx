import { PropertyData } from "@/PropertyDataContext";
import { calcOutsadingBalance, calcPropertyValuation } from "@/lib/calcs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function CompleteAnalysisChart(props: {
  propertyData: PropertyData;
  context: string;
}) {
  const { propertyData } = props;

  const values: {
    outsadingBalance: number;
    invested: number;
    propertyValue: number;
  }[] = [];

  let capitalAcumulado =
    props.context === "financing"
      ? propertyData.personalBalance -
        propertyData.financingFees -
        propertyData.downPayment
      : propertyData.personalBalance - propertyData.propertyValue;

  let rentValue = propertyData.initialRentValue;

  for (let i = 1; i <= propertyData.finalYear * 12; i++) {
    const year = Math.floor((i - 1) / 12);

    if (i % 12 === 1 || i === 1) {
      rentValue = propertyData.rentValue![year];
    }

    const montanteAluguel =
      props.context === "financing"
        ? Number((rentValue - propertyData.installmentValue).toFixed(2))
        : Number(rentValue.toFixed(2));

    let lucroMensal = 0;
    if (capitalAcumulado >= 0 || props.context === "financing") {
      lucroMensal = Number(
        ((capitalAcumulado * propertyData.monthlyIncome) / 100).toFixed(2)
      );
    }

    const valorFinal = Number(
      (capitalAcumulado + lucroMensal + montanteAluguel).toFixed(2)
    );

    const outsadingBalance = calcOutsadingBalance(
      propertyData.propertyValue - propertyData.downPayment,
      propertyData.interestRate,
      propertyData.financingYears,
      i
    );

    const propertyValue = calcPropertyValuation(
      propertyData.propertyValue,
      propertyData.interestRate,
      Math.ceil(i / 12)
    );

    values.push({
      outsadingBalance: outsadingBalance,
      invested: valorFinal,
      propertyValue: propertyValue,
    });

    capitalAcumulado = valorFinal;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      datalabels: {
        display: false,
      },
    },
  };

  console.log(values.map((v) => v.propertyValue));

  const data = {
    labels: values.map((_v, i) => i),
    datasets: [
      {
        label: "Valor do Imóvel",
        data: values.map((v) => v.propertyValue),
        borderColor: "#0073d7",
        backgroundColor: "#0073d7",
        pointRadius: 0,
      },
      {
        label: "Saldo Devedor",
        data: values.map((v) => v.outsadingBalance),
        borderColor: "#a41d3f",
        backgroundColor: "#a41d3f",
        pointRadius: 0,
      },
      {
        label: "Patrimônio Renda Fixa",
        data: values.map((v) => v.invested),
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
