import { FaFileCircleCheck } from "react-icons/fa6";
import DashboardPaper from "./DashboardPaper";
import { FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useEffect } from "react";
import { AiFillFileText } from "react-icons/ai";

import {
  fetchLastSessions,
  fetchUserDashboardData,
} from "@/store/dashboard/userDashboardReducer";

import SessionsTable from "@/components/session/SessionTable";

interface UserDashboardProps {
  userId?: string;
}

export default function UserDashboard(props: UserDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.userDashboard);

  useEffect(() => {
    dispatch(fetchUserDashboardData(props.userId));
    dispatch(fetchLastSessions(props.userId));
  }, [dispatch, props.userId]);

  return (
    <div className="overflow-x-hidden">
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
      <div className="grid grid-cols-3 gap-10 mt-5">
        <div className="col-span-2 bg-gradient-to-r from-whitefull to-white border border-grayScale-200 text-white p-7 shadow-lg rounded-lg">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold mb-4">Últimas Sessões</h2>
          </div>
          <div>
            <SessionsTable sessions={data.lastSessions} />
          </div>
        </div>
      </div>
    </div>
  );
}
