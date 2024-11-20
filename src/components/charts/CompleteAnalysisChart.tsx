import { Line } from "react-chartjs-2";

export default function CompleteAnalysisChart(props: {
  propertyValues?: number[];
  outstandingBalanceValues?: number[];
  investedEquityValues?: number[];
  profitValues?: number[];
  color: string;
  title: string;
}) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          padding: 12,
        },
      },
      datalabels: {
        display: false,
      },
    },
  };

  const allValuesAreZero = (arr: number[]) => arr.every((value) => value === 0);

  const datasets = [];

  if (props.propertyValues && !allValuesAreZero(props.propertyValues)) {
    datasets.push({
      label: "Valor do Imóvel",
      data: props.propertyValues,
      borderColor: "#0073d7",
      backgroundColor: "#0073d7",
      pointRadius: 0,
    });
  }

  if (
    props.investedEquityValues &&
    !allValuesAreZero(props.investedEquityValues)
  ) {
    datasets.push({
      label: "Patrimônio Renda Fixa",
      data: props.investedEquityValues,
      borderColor: "#ff6347",
      backgroundColor: "#ff6347",
      pointRadius: 0,
    });
  }

  if (
    props.outstandingBalanceValues &&
    props.outstandingBalanceValues.length > 0 &&
    !allValuesAreZero(props.outstandingBalanceValues)
  ) {
    datasets.push({
      label: "Saldo Devedor",
      data: props.outstandingBalanceValues,
      borderColor: "#a41d3f",
      backgroundColor: "#a41d3f",
      pointRadius: 0,
    });
  }

  if (
    props.profitValues &&
    props.profitValues.length > 0 &&
    !allValuesAreZero(props.profitValues)
  ) {
    datasets.push({
      label: "Lucro",
      data: props.profitValues,
      borderColor: "#28a745",
      backgroundColor: "#28a745",
      pointRadius: 0,
    });
  }

  const maxLength = Math.max(
    props.propertyValues?.length || 0,
    props.investedEquityValues?.length || 0,
    props.outstandingBalanceValues?.length || 0,
    props.profitValues?.length || 0
  );

  const data = {
    labels: Array.from({ length: maxLength }, (_, i) => i),
    datasets,
  };

  return (
    <div style={{ borderColor: props.color }} className="rounded-2xl border">
      <div
        style={{ borderColor: props.color }}
        className="border-b w-full px-10 py-5"
      >
        <h5 style={{ color: props.color }}>
          <strong>{props.title}</strong>
        </h5>
      </div>

      <Line className="p-5" options={options} data={data} />
    </div>
  );
}
