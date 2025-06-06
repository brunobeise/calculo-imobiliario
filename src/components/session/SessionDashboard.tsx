import React from "react";
import { Bar, Bubble } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BubbleController,
} from "chart.js";
import { Session } from "@/types/sessionTypes";
import SessionsTable from "./SessionTable";
import dayjs from "dayjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BubbleController
);

interface SessionDashboardProps {
  sessions: Session[];
}

export const SessionDashboard: React.FC<SessionDashboardProps> = ({
  sessions,
}) => {
  const uniqueDates = Array.from(
    new Set(sessions.map((s) => dayjs(s.createdAt).format("DD/MMM")))
  ).sort();

  const countsMap = new Map<string, number>();
  sessions.forEach((session) => {
    const date = dayjs(session.createdAt).format("DD/MMM");
    const hour = dayjs(session.createdAt).hour();
    const key = `${date}|${hour}`;
    countsMap.set(key, (countsMap.get(key) || 0) + 1);
  });

  const bubbleDataPointsAggregated = Array.from(countsMap.entries()).map(
    ([key, count]) => {
      const [date, hourStr] = key.split("|");
      const hour = Number(hourStr);
      return {
        x: date,
        y: hour,
        r: Math.sqrt(count) * 6,
      };
    }
  );

  const bubbleData = {
    datasets: [
      {
        label: "Visualizações",
        data: bubbleDataPointsAggregated,
        backgroundColor: "#103759",
      },
    ],
  };

  const bubbleOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const item = tooltipItems[0];
            return dayjs(item.raw.x, "DD/MMM").format("DD/MM/YYYY"); // formata
          },
          label: (tooltipItem) =>
            `${tooltipItem.parsed.y}h, Visualizações: ${Math.round(
              tooltipItem.raw.r ** 2 / 36
            )}`,
        },
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        type: "category" as const,
        labels: ["", ...uniqueDates, ""],
        title: {
          display: true,
          text: "Data",
        },
        grid: {
          display: true,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        type: "linear" as const,
        min: 0,
        max: 23,
        ticks: {
          stepSize: 1,
          callback: (val) => `${val}h`,
        },
        title: {
          display: true,
          text: "Hora do dia",
        },
        grid: {
          display: true,
        },
      },
    },
  };

  const viewsByHour = new Array(24).fill(0);
  sessions.forEach((v) => {
    const hour = dayjs(v.createdAt).hour();
    viewsByHour[hour]++;
  });
  const viewsByHourLabels = [...Array(24).keys()].map((h) => `${h}h`);

  const filteredLabels: string[] = [];
  const filteredData: number[] = [];
  for (let i = 0; i < viewsByHour.length; i++) {
    if (viewsByHour[i] > 0) {
      filteredLabels.push(viewsByHourLabels[i]);
      filteredData.push(viewsByHour[i]);
    }
  }

  return (
    <div className="flex justify-center pb-10">
      <div className="flex gap-12 justify-center">
        <div className="flex-1 flex flex-col gap-6">
          {sessions.length !== 0 && (
            <>
              <div className="bg-white border border-grayScale-200 p-10 shadow-lg rounded-lg h-[480px] w-[820px]">
                <h2 className="text-lg font-bold mb-4">
                  Visualizações ao longo do tempo
                </h2>
                <Bubble data={bubbleData} options={bubbleOptions} />
              </div>

              <div className="bg-white border border-grayScale-200 p-10 shadow-lg rounded-lg h-[480px] w-[820px]">
                <h2 className="text-lg font-bold mb-4">
                  Visualizações por horário do dia
                </h2>
                <Bar
                  data={{
                    labels: viewsByHourLabels,
                    datasets: [
                      {
                        label: "Visualizações",
                        data: viewsByHour,
                        backgroundColor: "#103759",
                      },
                    ],
                  }}
                  options={{
                    indexAxis: "x",
                    responsive: true,
                    plugins: {
                      datalabels: {
                        display: (context) =>
                          context.dataset.data[context.dataIndex] !== 0,
                        color: "white",
                        font: { weight: "bold" },
                      },
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            context.parsed.y === 0
                              ? ""
                              : `Visualizações: ${context.parsed.y}`,
                        },
                      },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                        ticks: {
                          color: "#103759",
                        },
                      },
                      y: {
                        ticks: {
                          stepSize: 1,
                          color: "#103759",
                        },
                      },
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div
          className={`flex ${
            sessions.length === 0 ? "justify-center" : "justify-start"
          } w-[500px]`}
        >
          <SessionsTable sessions={sessions} />
        </div>
      </div>
    </div>
  );
};
