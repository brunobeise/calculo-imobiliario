import { FaFileCircleCheck, FaUsers } from "react-icons/fa6";
import DashboardPaper from "./DashboardPaper";
import { FaFileAlt } from "react-icons/fa";
import { LineChart } from "@/components/charts/shared/LineChart";
import { Option, Select } from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect, useState } from "react";
import {
  fetchFeaturedUsers,
  fetchOwnerDashboardData,
  fetchOwnerProposalsChart,
} from "@/store/dashboard/ownerDashboardReducer";
import DashboardRank from "./DashboardRank";

interface OwnerDashboardProps {
  realEstate?: string;
}

export default function OwnerDashboard(props: OwnerDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.ownerDashboard);

  const [proposalChartFilter, setProposalChartFilter] =
    useState("last_6_months");
  useEffect(() => {
    dispatch(fetchOwnerDashboardData(props.realEstate));
    dispatch(fetchFeaturedUsers(props.realEstate));
  }, [dispatch, props.realEstate]);

  useEffect(() => {
    dispatch(
      fetchOwnerProposalsChart({
        filter: proposalChartFilter,
        realEstate: props.realEstate,
      })
    );
  }, [dispatch, proposalChartFilter, props.realEstate]);

  return (
    <div className="overflow-x-hidden">
      <div className="grid grid-cols-3 gap-10 ">
        <DashboardPaper
          value={data.activeUsers}
          title="Corretores"
          icon={<FaUsers />}
        />
        <DashboardPaper
          value={data.totalProposals}
          title="Propostas Geradas"
          icon={<FaFileAlt />}
        />
        <DashboardPaper
          value={data.acceptedProposals}
          title="Propostas Aceitas"
          icon={<FaFileCircleCheck />}
        />
      </div>
      <div className="grid grid-cols-3 gap-10 mt-5">
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
        </div>
        <div>
          <DashboardRank
            loading={data.featuredUsersLoading}
            data={data.featuredUsers}
            title="Corretores destaque"
          />
        </div>
      </div>
    </div>
  );
}