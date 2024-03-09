import { PropertyData } from "@/PropertyDataContext";
import { numeroParaReal } from "@/lib/formatter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
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
  Filler,
  Legend
);

export function MonthlyInvestmentGrowthChart(props: {
  propertyData: PropertyData;
  context: string;
}) {
  const { propertyData } = props;

  const values: number[] = [];

  let capitalAcumulado =
    props.context === "financing"
      ? propertyData.personalBalance -
        propertyData.financingFees -
        propertyData.downPayment
      : propertyData.personalBalance - propertyData.propertyValue;

  let rentValue = propertyData.initialRentValue;

  for (let mes = 1; mes <= propertyData.finalYear * 12; mes++) {
    const indiceAno = Math.floor((mes - 1) / 12);

    if (mes % 12 === 1 || mes === 1) {
      rentValue = propertyData.rentValue![indiceAno];
    }

    const montanteAluguel =
      props.context === "financing"
        ? Number((rentValue - propertyData.installmentValue).toFixed(2))
        : Number(rentValue.toFixed(2));

    let lucroMensal = 0;
    if (capitalAcumulado >= 0 || props.context === "financing") {
      lucroMensal = Number(
        ((capitalAcumulado * propertyData.monthlyYieldRate) / 100).toFixed(2)
      );
    }

    const valorFinal = Number(
      (capitalAcumulado + lucroMensal + montanteAluguel).toFixed(2)
    );

    values.push(lucroMensal + montanteAluguel);

    capitalAcumulado = valorFinal;
  }

  const options = {
    responsive: true,
    labels: {
      display: false,
    },
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: function (context: any) {
            return "Montante do mês: " + numeroParaReal(context.parsed.y);
          },
        },
      },
    },
  };

  const data = {
    labels: values.map((_v, i) => i),
    datasets: [
      {
        fill: true,
        label: "Rendimento + Aluguel - Parcela",
        data: values,
        borderColor: "#002f57",
        backgroundColor: "#002e57e1",
        pointRadius: 0,
      },
    ],
  };

  return <Line options={options} data={data} />;
}
