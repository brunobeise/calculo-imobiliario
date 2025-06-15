/* eslint-disable @typescript-eslint/no-unused-vars */
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

interface UserDashboardProps {
  userId?: string;
}

export default function UserDashboard(props: UserDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.userDashboard);
  const [proposalChartFilter, setProposalChartFilter] =
    useState("last_6_months");
  const [proposalTypeChartFilter] = useState("last_6_months");
  const [proposalSubTypeChartFilter] = useState("last_6_months");

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-10 mt-5">
        <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-whitefull to-white border border-grayScale-200 p-5 shadow-lg rounded-lg">
          <h2 className="text-lg font-bold mb-4">Últimas Sessões</h2>
          <div className="overflow-y-auto max-h-[420px] pe-3">
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

        {/* <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 p-5 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Propostas por Tipo</h2>
            <Select
              value={proposalTypeChartFilter}
              onChange={(_, v) => setProposalTypeChartFilter(v || "")}
              className="!min-w-[140px]"
            >
              <Option value="last_7_days">7 dias</Option>
              <Option value="last_30_days">30 dias</Option>
              <Option value="last_3_months">3 meses</Option>
              <Option value="last_6_months">6 meses</Option>
              <Option value="last_year">Ano passado</Option>
              <Option value="current_year">Esse ano</Option>
              <Option value="all_time">Tudo</Option>
            </Select>
          </div>
          <DonutChart
            width={200}
            labels={data.proposalTypeChart.labels.map(getCaseTitle)}
            datasets={[{ data: data.proposalTypeChart.values }]}
            tooltipFormatter={(value) => `Propostas: ${value}`}
          />
        </div> */}

        <div className="col-span-1 md:col-span-3 bg-gradient-to-r from-whitefull to-white border border-grayScale-200 p-5 shadow-lg rounded-lg">
          <div className="flex justify-between mb-4">
            <h2 className="text-lg font-bold">Propostas Geradas</h2>
            <Select
              value={proposalChartFilter}
              onChange={(_, v) => setProposalChartFilter(v || "")}
              className="!min-w-[140px]"
            >
              <Option value="last_7_days">7 dias</Option>
              <Option value="last_30_days">30 dias</Option>
              <Option value="last_3_months">3 meses</Option>
              <Option value="last_6_months">6 meses</Option>
              <Option value="last_year">Ano passado</Option>
              <Option value="current_year">Esse ano</Option>
              <Option value="all_time">Tudo</Option>
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
              datasets={[{ data: data.proposalsChart.values }]}
              tooltipFormatter={(value) => `Propostas: ${value}`}
              showLegend={false}
            />
          )}
        </div>

        {/* <div className="bg-gradient-to-r from-whitefull to-white border border-grayScale-200 p-5 shadow-lg rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Nível das Propostas</h2>
            <Select
              value={proposalSubTypeChartFilter}
              onChange={(_, v) => setProposalSubTypeChartFilter(v || "")}
              className="!min-w-[140px]"
            >
              <Option value="last_7_days">7 dias</Option>
              <Option value="last_30_days">30 dias</Option>
              <Option value="last_3_months">3 meses</Option>
              <Option value="last_6_months">6 meses</Option>
              <Option value="last_year">Ano passado</Option>
              <Option value="current_year">Esse ano</Option>
              <Option value="all_time">Tudo</Option>
            </Select>
          </div>
          <DonutChart
            width={300}
            labels={data.proposalSubTypeChart.labels}
            datasets={[{ data: data.proposalSubTypeChart.values }]}
            tooltipFormatter={(value) => `Propostas: ${value}`}
          />
        </div> */}
      </div>
    </div>
  );
}
