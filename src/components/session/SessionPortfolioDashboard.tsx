import React from "react";
import { PortfolioSession } from "@/types/sessionTypes";
import PortfolioSessionsTable from "./SessionPortfolioTable";
import { DonutChart } from "../charts/shared/DonutChart";

interface SessionPortfolioDashboardProps {
  portfolioSessions: PortfolioSession[];
}

export const SessionPortfolioDashboard: React.FC<
  SessionPortfolioDashboardProps
> = ({ portfolioSessions }) => {
  const timePerItemMap = new Map<string, number>();

  portfolioSessions.forEach((session) => {
    Object.entries(session).forEach(([key, value]) => {
      if (/^item\d+TimeVisible$/.test(key) && value) {
        const itemNumber = key.match(/^item(\d+)TimeVisible$/)?.[1];
        if (!itemNumber) return;
        const nameKey = `item${itemNumber}Name`;
        const itemName = session[nameKey] || `Item ${itemNumber}`;
        timePerItemMap.set(
          itemName,
          (timePerItemMap.get(itemName) || 0) + (value || 0)
        );
      }
    });
  });

  const labels = Array.from(timePerItemMap.keys());
  const values = Array.from(timePerItemMap.values());
  const totalTime = values.reduce((acc, val) => acc + val, 0);
  const data = values.map((val) => (val / totalTime) * 100);

  if (data.length === 0) {
    return <div className="text-center p-10">Nenhuma visualização até o momento</div>;
  }

  return (
    <div className="flex justify-center gap-12 pt-5">
      <div className="bg-white border border-grayScale-200 p-10 shadow-lg rounded-lg h-min">
        <h2 className="mb-4">Gráfico de interesse</h2>
        <DonutChart
          labels={labels}
          datasets={[{ data: values }]} 
          tooltipFormatter={(value) => `${value.toFixed(0)} segundos`}
          datalabelsOptions={{
            formatter: (value: number, context) => {
              const dataset = context.chart.data.datasets[0];
              const total = dataset.data.reduce(
                (a: number, b: number) => a + b,
                0
              );
              const percent = ((value / total) * 100).toFixed(1);
              return `${percent}%`;
            },
          }}
          width={320}
        />
      </div>

      <div className="w-[400px]">
        <PortfolioSessionsTable sessions={portfolioSessions} />
      </div>
    </div>
  );
};
