import React, { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import { Session } from "@/types/sessionTypes";
import { Chip, IconButton, Sheet, Table } from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { formatTime } from "@/lib/formatter";

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

  return (
    <>
      <tr>
        <td>
          <IconButton
            aria-label="expand row"
            variant="plain"
            color="neutral"
            size="sm"
            onClick={handleToggle}
          >
            {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </td>

        <td>{dayjs(session.createdAt).format("HH:mm")}</td>
        <td className="px-2">-</td>
        <td>{formatTime(session.sessionTime)}</td>

        <td className="ps-4">
          {session.isNew && (
            <Chip
              size="sm"
              className="!bg-[#e3effb] !text-[#1a6abe] border border-[#1a6abe] mb-2"
              variant="solid"
              color="neutral"
            >
              Novo
            </Chip>
          )}
        </td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={3} style={{ padding: 0 }}>
            <Sheet
              variant="soft"
              sx={{
                p: 1,
                pl: 1,
              }}
            >
              <Table size="sm" aria-label="page times">
                <thead>
                  <tr>
                    <td>Página</td>
                    <td>Tempo de visualização</td>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((page) => (
                    <tr key={`page${page}`}>
                      <td>{pageTitles[page - 1]}</td>{" "}
                      <td>{formatTime(session[`page${page}TimeVisible`])}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          </td>
        </tr>
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
        <div key={dateLabel} className="mb-4">
          <h3 className="text-lg font-bold border-b pb-1 mb-2">{dateLabel}</h3>
          <div className="space-y-2">
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
          Nenhuma sessão até o momento
        </span>
      )}
    </div>
  );
};

export default SessionsTable;
