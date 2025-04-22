import React, { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { Chip, IconButton, Table } from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatTime } from "@/lib/formatter";
import { FaRegClock } from "react-icons/fa";
import { IoPersonCircleOutline } from "react-icons/io5";
import { FaRegHourglassHalf } from "react-icons/fa6";
import { PortfolioSession } from "@/types/sessionTypes";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.locale("pt-br");

const groupSessionsByDate = (sessions: PortfolioSession[]) => {
  const grouped: Record<string, PortfolioSession[]> = {};
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

function PortfolioSessionRow(props: {
  session: PortfolioSession;
  openSessionId: string | null;
  setOpenSessionId: (id: string | null) => void;
}) {
  const { session, openSessionId, setOpenSessionId } = props;
  const isOpen = openSessionId === session.id;

  const handleToggle = () => {
    setOpenSessionId(isOpen ? null : session.id);
  };

  const visibleItems = Array.from({ length: 10 }, (_, i) => i + 1).filter(
    (i) => session[`item${i}TimeVisible`] > 0
  );

  return (
    <>
      <div className="text-black flex items-center justify-between space-x-3 text-grayText">
        <div className="flex">
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
              <IoPersonCircleOutline className="text-gray-500 flex-shrink-0" />
              <span className="text-nowrap ">{session.viewerName}</span>
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

        {visibleItems.length > 0 ? (
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
          <Table size="sm" aria-label="item view times">
            <thead>
              <tr>
                <th>Item</th>
                <th>Tempo de visualização</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((i) =>
                session[`item${i}TimeVisible`] > 0 ? (
                  <tr key={`item${i}`}>
                    <td>{session[`item${i}Name`] || `Item ${i}`}</td>
                    <td>{formatTime(session[`item${i}TimeVisible`])}</td>
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

interface PortfolioSessionsTableProps {
  sessions: PortfolioSession[];
}

const PortfolioSessionsTable: React.FC<PortfolioSessionsTableProps> = ({
  sessions,
}) => {
  const groupedSessions = groupSessionsByDate(sessions);
  const [openSessionId, setOpenSessionId] = useState<string | null>(null);

  return (
    <div>
      {Object.entries(groupedSessions).map(([dateLabel, sessionList]) => (
        <div key={dateLabel} className="mb-8">
          <h3 className="text-md font-bold pb-1 mb-2">{dateLabel}</h3>
          <div className="space-y-2 border-t border-border pt-2">
            {sessionList.map((session) => (
              <PortfolioSessionRow
                key={session.id}
                session={session}
                openSessionId={openSessionId}
                setOpenSessionId={setOpenSessionId}
              />
            ))}
          </div>
        </div>
      ))}
      {sessions.length === 0 && (
        <span className="text-center mt-10 text-grayText">
          Nenhuma sessão até o momento
        </span>
      )}
    </div>
  );
};

export default PortfolioSessionsTable;
