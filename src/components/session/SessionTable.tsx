import React, { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { Session } from "@/types/sessionTypes";
import { Chip, IconButton, Table } from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatTime } from "@/lib/formatter";
import { FaRegClock } from "react-icons/fa";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { FaFileAlt } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { navigate } from "vike/client/router";
import { getCaseLink } from "@/lib/maps";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const groupSessionsByDate = (sessions: Session[]) => {
  const grouped: Record<string, Session[]> = {};
  const now = dayjs();

  sessions.forEach((session) => {
    const sessionDate = dayjs(session.createdAt);
    let key;

    if (sessionDate.isSame(now, "day")) {
      key = "Hoje";
    } else if (sessionDate.isSame(now.subtract(1, "day"), "day")) {
      key = "Ontem";
    } else if (sessionDate.isBefore(now.subtract(5, "day"))) {
      key = sessionDate.format("DD/MM/YYYY");
    } else {
      key = sessionDate.format("dddd");
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(session);
  });

  return grouped;
};

function SessionRow(props: {
  session: Session;
  openSessionId: number | null;
  setOpenSessionId: (id: number | null) => void;
  showName?: boolean;
}) {
  const { session, openSessionId, setOpenSessionId } = props;
  const isOpen = openSessionId === session.id;

  const handleToggle = () => {
    setOpenSessionId(isOpen ? null : session.id);
  };

  const pageTitles = [
    "Introdução",
    "Pagamento e retorno esperado",
    "Cálculo do investimento",
    "Divisão do capital",
    "Conversão para valor presente",
    "Reinvestimento em Renda Fixa",
    "Análise Gráfica Detalhada",
    "Descrição do imóvel",
  ];

  const visiblePagesCount = Array.from({ length: 8 }, (_, i) => i + 1).filter(
    (page) => session[`page${page}TimeVisible`] > 0
  ).length;

  return (
    <>
      <div className="text-black flex items-center justify-between space-x-3 text-grayText">
        <div className="flex">
          {session.case && (
            <div
              onClick={() =>
                navigate(getCaseLink(session.case.type) + "/" + session.case.id)
              }
              className="flex items-center space-x-2 pe-4 w-[200px] min-w-0 hover:text-primary cursor-pointer"
            >
              <FaFileAlt className="text-gray-500 flex-shrink-0" />
              <span className="overflow-hidden text-ellipsis whitespace-nowrap block">
                {session.case.name}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-1 w-[80px]">
            <FaRegClock className="text-gray-500" />
            <span>{dayjs(session.createdAt).format("HH:mm")}</span>
          </div>

          <div className="flex items-center space-x-1 w-[80px]">
            <FaRegHourglassHalf className="text-gray-500" />
            <span>{formatTime(session.sessionTime)}</span>
          </div>

          {session.viewerName && (
            <div className="flex items-center space-x-1 w-[120px]">
              <IoPersonCircleOutline className="text-gray-500  flex-shrink-0" />
              <span className="text-nowrap">{session.viewerName}</span>
            </div>
          )}

          {session.isNew && (
            <Chip
              size="sm"
              className="!bg-[#e3effb] !text-[#1a6abe] border border-[#1a6abe] ms-4"
              variant="solid"
              color="neutral"
            >
              Novo
            </Chip>
          )}
        </div>

        {visiblePagesCount > 1 ? (
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={handleToggle}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        ) : (
          <div className="w-[32px] h-[32px]" />
        )}
      </div>

      {isOpen && (
        <div className="p-1">
          <Table aria-label="page times">
            <thead>
              <tr>
                <th className="!bg-background">Página</th>
                <th className="!bg-background">Tempo de visualização</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }, (_, i) => i + 1).map((page) =>
                session[`page${page}TimeVisible`] > 0 ? (
                  <tr key={`page${page}`}>
                    <td>{pageTitles[page - 1]}</td>
                    <td>{formatTime(session[`page${page}TimeVisible`])}</td>
                  </tr>
                ) : null
              )}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}

interface SessionsTableProps {
  sessions: Session[];
}

const SessionsTable: React.FC<SessionsTableProps> = ({ sessions }) => {
  const groupedSessions = groupSessionsByDate(sessions);
  const [openSessionId, setOpenSessionId] = useState<number>();

  return (
    <div>
      {Object.entries(groupedSessions).map(([dateLabel, sessionList]) => (
        <div key={dateLabel} className="mb-8">
          <h3 className="text-md font-bold pb-1 mb-2">{dateLabel}</h3>
          <div className="space-y-2 border-t border-border pt-2">
            {sessionList.map((session) => (
              <SessionRow
                key={session.id}
                session={session}
                openSessionId={openSessionId}
                setOpenSessionId={(id) => setOpenSessionId(id)}
                showName
              />
            ))}
          </div>
        </div>
      ))}
      {sessions.length === 0 && (
        <span className="text-center mt-10 text-grayText">
          Nenhuma visualização até o momento
        </span>
      )}
    </div>
  );
};

export default SessionsTable;
