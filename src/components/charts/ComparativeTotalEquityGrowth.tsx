import { PropertyData } from "@/PropertyDataContext";
import { calcOutstandingBalance, calcPropertyValuation } from "@/lib/calcs";
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

export default function ComparativeTotalEquityGrowth({
  propertyData,
}: {
  propertyData: PropertyData;
}) {
  const calculateContext = (context: string) => {
    const values: {
      outsadingBalance: number;
      invested: number;
      propertyValue: number;
    }[] = [];

    let capitalAcumulado =
      context === "financing"
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
        context === "financing"
          ? Number((rentValue - propertyData.installmentValue).toFixed(2))
          : Number(rentValue.toFixed(2));

      let lucroMensal = 0;
      if (capitalAcumulado >= 0 || context === "financing") {
        lucroMensal = Number(
          ((capitalAcumulado * propertyData.monthlyIncome) / 100).toFixed(2)
        );
      }

      const valorFinal = Number(
        (capitalAcumulado + lucroMensal + montanteAluguel).toFixed(2)
      );

      const outsadingBalance =
        context === "financing"
          ? calcOutstandingBalance(
              propertyData.propertyValue - propertyData.downPayment,
              propertyData.interestRate,
              propertyData.financingYears,
              i
            )
          : 0;

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
    return values;
  };
  const financingValues = calculateContext("financing").map(
    (v) => v.invested + v.propertyValue - v.outsadingBalance
  );

  const inCashValues = calculateContext("inCash").map(
    (v) => v.invested + v.propertyValue - v.outsadingBalance
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      datalabels: {
        display: false,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return `Total assets: ${context.parsed.y.toFixed(2)}`;
          },
        },
      },
    },
  };

  const data = {
    labels: Array.from(
      { length: propertyData.finalYear * 12 },
      (_, i) => i + 1
    ),
    datasets: [
      {
        label: "Patrimônio (À Vista)",
        data: inCashValues,
        borderColor: "#0073d7",
        backgroundColor: "#0073d7",
        pointRadius: 0,
      },
      {
        label: "Patrimônio (Financiamento)",
        data: financingValues,
        borderColor: "#1e476b",
        backgroundColor: "#1e476b",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
