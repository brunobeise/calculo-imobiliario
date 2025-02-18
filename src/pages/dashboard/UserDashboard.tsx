import { FaFileCircleCheck } from "react-icons/fa6";
import DashboardPaper from "./DashboardPaper";
import { FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { AiFillFileText } from "react-icons/ai";

import {
  fetchLastSessions,
  fetchUserDashboardData,
  fetchUserProposalsChart,
  fetchUserProposalsSubTypeChart,
  fetchUserProposalsTypeChart,
} from "@/store/dashboard/userDashboardReducer";

import SessionsTable from "@/components/session/SessionTable";
import { LineChart } from "@/components/charts/shared/LineChart";
import { Option, Select, Skeleton } from "@mui/joy";
import { DonutChart } from "@/components/charts/shared/DonutChart";
import { getCaseTitle } from "@/lib/maps";

interface UserDashboardProps {
  userId?: string;
}

export default function UserDashboard(props: UserDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.userDashboard);
  const [proposalChartFilter, setProposalChartFilter] =
    useState("last_6_months");
  const [proposalTypeChartFilter, setProposalTypeChartFilter] =
    useState("last_6_months");
  const [proposalSubTypeChartFilter, setProposalSubTypeChartFilter] =
    useState("last_6_months");

  useEffect(() => {
    dispatch(fetchUserDashboardData(props.userId));
    dispatch(fetchLastSessions(props.userId));
  }, [dispatch, props.userId]);

  useEffect(() => {
    dispatch(
      fetchUserProposalsChart({
        filter: proposalChartFilter,
        userId: props.userId,
      })
    );
  }, [dispatch, proposalChartFilter, props.userId]);

  useEffect(() => {
    dispatch(
      fetchUserProposalsTypeChart({
        filter: proposalTypeChartFilter,
        userId: props.userId,
      })
    );
  }, [dispatch, proposalTypeChartFilter, props.userId]);

  useEffect(() => {
    dispatch(
      fetchUserProposalsSubTypeChart({
        filter: proposalSubTypeChartFilter,
        userId: props.userId,
      })
    );
  }, [dispatch, proposalSubTypeChartFilter, props.userId]);

  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-10 ">
        <DashboardPaper
          loading={data.inProgressProposals === undefined}
          value={data.inProgressProposals}
          title="Propostas em andamento"
          icon={<AiFillFileText />}
        />
        <DashboardPaper
          loading={data.totalProposals === undefined}
          value={data.totalProposals}
          title="Propostas geradas"
          icon={<FaFileAlt />}
        />
        <DashboardPaper
          loading={data.acceptedProposals === undefined}
          value={data.acceptedProposals}
          title="Propostas Aceitas"
          icon={<FaFileCircleCheck />}
        />
      </div>
      <div className="grid grid-cols-3 gap-10 gap-y-5 mt-5">
        <div className="col-span-2 bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-7 shadow-lg rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-4">Últimas Sessões</h2>
          </div>
          <div className="overflow-y-auto max-h-[420px] pe-5">
            {data.lastSessionsLoading ? (
              <Skeleton
                variant="rectangular"
                height={400}
                className="rounded-lg"
              />
            ) : (
              <SessionsTable sessions={data.lastSessions} />
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-7 shadow-lg rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-4">Propostas por Tipo</h2>
            <Select
              value={proposalTypeChartFilter}
              onChange={(_, v) => setProposalTypeChartFilter(v || "")}
            >
              <Option value="last_7_days">Últimos 7 dias</Option>
              <Option value="last_30_days">Últimos 30 dias</Option>
              <Option value="last_3_months">Últimos 3 meses</Option>
              <Option value="last_6_months">Últimos 6 meses</Option>
              <Option value="last_year">Último ano</Option>
              <Option value="current_year">Esse ano</Option>
              <Option value="all_time">Desde o início</Option>
            </Select>
          </div>

          <div className="py-5">
            <DonutChart
              height={100}
              labels={data.proposalTypeChart.labels.map((label) =>
                getCaseTitle(label)
              )}
              datasets={[
                {
                  data: data.proposalTypeChart.values,
                },
              ]}
              tooltipFormatter={(value) => `Propostas: ${value}`}
            />
          </div>
        </div>
        <div className="col-span-2 bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-7 shadow-lg rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-4">Propostas Geradas</h2>
            <Select
              value={proposalChartFilter}
              onChange={(_, v) => setProposalChartFilter(v || "")}
            >
              <Option value="last_7_days">Últimos 7 dias</Option>
              <Option value="last_30_days">Últimos 30 dias</Option>
              <Option value="last_3_months">Últimos 3 meses</Option>
              <Option value="last_6_months">Últimos 6 meses</Option>
              <Option value="last_year">Último ano</Option>
              <Option value="current_year">Esse ano</Option>
              <Option value="all_time">Desde o início</Option>{" "}
            </Select>
          </div>
          {data.proposalChartLoading && !data.proposalsChart ? (
            <Skeleton
              variant="rectangular"
              height={300}
              className="rounded-lg mt-5"
            />
          ) : (
            <LineChart
              height={100}
              labels={data.proposalsChart.labels}
              datasets={[
                {
                  data: data.proposalsChart.values,
                },
              ]}
              tooltipFormatter={(value) => `Propostas: ${value}`}
              showLegend={false}
            />
          )}
        </div>
        <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-7 shadow-lg rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-4">Nível das Propostas</h2>
            <Select
              value={proposalSubTypeChartFilter}
              onChange={(_, v) => setProposalSubTypeChartFilter(v || "")}
            >
              <Option value="last_7_days">Últimos 7 dias</Option>
              <Option value="last_30_days">Últimos 30 dias</Option>
              <Option value="last_3_months">Últimos 3 meses</Option>
              <Option value="last_6_months">Últimos 6 meses</Option>
              <Option value="last_year">Último ano</Option>
              <Option value="current_year">Esse ano</Option>
              <Option value="all_time">Desde o início</Option>
            </Select>
          </div>

          <div className="py-5 relative">
            <DonutChart
              absoluteLegends
              height={100}
              labels={data.proposalSubTypeChart.labels}
              datasets={[
                {
                  data: data.proposalSubTypeChart.values,
                },
              ]}
              tooltipFormatter={(value) => `Propostas: ${value}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
