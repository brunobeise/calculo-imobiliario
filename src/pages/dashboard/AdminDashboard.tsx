import { FaUsers } from "react-icons/fa6";
import DashboardPaper from "./DashboardPaper";
import { MdOutlineRealEstateAgent } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { LineChart } from "@/components/charts/shared/LineChart";
import { Option, Select, Skeleton } from "@mui/joy";
import DashboardRank from "./DashboardRank";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAdminDashboardData,
  fetchFeaturedRealEstates,
  fetchProposalsChart,
} from "@/store/dashboard/adminDashboardReducer";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.adminDashboard);
  const [proposalChartFilter, setProposalChartFilter] =
    useState("last_6_months");
  useEffect(() => {
    dispatch(fetchAdminDashboardData());
    dispatch(fetchFeaturedRealEstates());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProposalsChart(proposalChartFilter));
  }, [dispatch, proposalChartFilter]);

  return (
    <div className="overflow-x-hidden">
      <div className="grid grid-cols-3 gap-10 ">
        <DashboardPaper
          loading={!data.activeUsers}
          value={data.activeUsers}
          title="Usuários ativos"
          icon={<FaUsers />}
        />
        <DashboardPaper
          loading={!data.realEstateCount}
          value={data.realEstateCount}
          title="Imobiliárias"
          icon={<MdOutlineRealEstateAgent />}
        />
        <DashboardPaper
          loading={!data.realEstateCount}
          value={data.totalProposals}
          title="Propostas Geradas"
          icon={<FaFileAlt />}
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
              <Option value="all_time">Desde o início</Option>
            </Select>
          </div>

          {data.loading ? (
            <Skeleton
              variant="rectangular"
              height={250}
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
        <div>
          <DashboardRank
            loading={data.featuredRealEstatesLoading}
            data={data.featuredRealEstates}
            title="Imobiliárias em destaque"
          />
        </div>
      </div>
    </div>
  );
}
