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
} from "@/store/dashboard/userDashboardReducer";
import { Table } from "@mui/joy";
import { SessionRow } from "../propostas/CaseSessionsModal";

interface UserDashboardProps {
  userId?: string;
}

export default function UserDashboard(props: UserDashboardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => state.userDashboard);
  const [openSessionId, setOpenSessionId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchUserDashboardData(props.userId));
    dispatch(fetchLastSessions(props.userId));
  }, [props.userId]);

  return (
    <div className="overflow-x-hidden">
      <div className="grid grid-cols-3 gap-10 ">
        <DashboardPaper
          value={data.inProgressProposals}
          title="Propostas em andamento"
          icon={<AiFillFileText />}
        />
        <DashboardPaper
          value={data.totalProposals}
          title="Propostas geradas"
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
            <h2 className="text-lg font-bold mb-4">Últimas Sessões</h2>
          </div>
          <div>
            {data.lastSessions.length > 0 ? (
              <Table aria-label="session table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }} aria-label="empty" />
                    <th>Proposta</th>
                    <th>Tempo de sessão</th>
                    <th>Data</th>
                    <th className="w-[80px]"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.lastSessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      openSessionId={openSessionId}
                      setOpenSessionId={setOpenSessionId}
                      showName
                    />
                  ))}
                </tbody>
              </Table>
            ) : (
              <span className="text-center mt-10 text-grayText">
                Nenhuma sessão até o momento
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
