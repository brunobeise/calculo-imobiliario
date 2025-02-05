import { Spinner } from "@/components/Loading";
import { IconButton, Table, Typography, Chip, Divider } from "@mui/joy";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  IoIosArrowBack,
  IoIosArrowDown,
  IoIosArrowForward,
  IoIosArrowUp,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { formatTime } from "@/lib/formatter";
import { Session } from "@/types/sessionTypes";
import { caseService } from "@/service/caseService";

interface CaseSessionsDrawerProps {
  caseId: string;
}

export default function CaseSessionsDrawer({
  caseId,
}: CaseSessionsDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(() => window.innerWidth > 1600);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [openSessionId, setOpenSessionId] = useState<number>();
  const loading = useSelector(
    (state: RootState) => state.proposals.sessionLoading
  );

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 1600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open) {
      caseService.getAllCaseSessions(caseId).then((result) => {
        setSessions(result);
      });
    }
  }, [dispatch, caseId, open]);

  return (
    <>
      {!open && (
        <div className="fixed right-0 z-50 bg-white shadow-md top-[50%]  translate-y-[-50%]">
          <button
            className="absolute right-0 z-50 bg-white shadow-md mt-7 !rounded-full p-2"
            onClick={() => setOpen(true)}
          >
            <IoIosArrowBack className="!text-primary !text-xl" />
          </button>
        </div>
      )}

      <div
        className={`fixed right-0 top-[50%] mt-7 translate-y-[-50%] h-[80%] bg-whitefull shadow transform transition-transform duration-300 ease-in-out  w-[420px] uw:w-[520px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center">
          <Typography level="h4" className="flex-grow">
            Visualizações
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <IoIosArrowForward />
          </IconButton>
        </div>

        <Divider />

        <div className="px-5 overflow-y-auto max-h-[80%]">
          {sessions.length > 0 ? (
            <Table stickyHeader aria-label="session table" className="w-full">
              <thead>
                <tr>
                  <th style={{ width: 40 }}></th>
                  <th style={{ width: 140 }}>Tempo de sessão</th>
                  <th>Data</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => {
                  const isOpen = openSessionId === session.id;

                  return (
                    <>
                      <tr key={session.id}>
                        <td>
                          <IconButton
                            aria-label="expand row"
                            variant="plain"
                            color="neutral"
                            size="sm"
                            onClick={() =>
                              setOpenSessionId(isOpen ? null : session.id)
                            }
                          >
                            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                          </IconButton>
                        </td>
                        <td>{formatTime(session.sessionTime)}</td>
                        <td>
                          {dayjs(session.createdAt).format(
                            "DD/MM/YYYY - HH:mm:ss"
                          )}
                        </td>
                        <td>
                          {session.isNew && (
                            <Chip
                              size="sm"
                              className="bg-blue-100 text-blue-700 border border-blue-700"
                              variant="solid"
                            >
                              Novo
                            </Chip>
                          )}
                        </td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={4} className="p-0">
                            <div className="bg-gray-100 p-2 shadow-inner">
                              <Table size="sm">
                                <thead>
                                  <tr>
                                    <th>Página</th>
                                    <th>Tempo de visualização</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.from(
                                    { length: 8 },
                                    (_, i) => i + 1
                                  ).map((page) => (
                                    <tr key={`page${page}`}>
                                      <td>Página {page}</td>
                                      <td>
                                        {formatTime(
                                          session[`page${page}TimeVisible`]
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </Table>
          ) : loading ? (
            <Spinner />
          ) : (
            <Typography className="p-4 text-center">
              Nenhuma visualização até o momento
            </Typography>
          )}
        </div>
      </div>
    </>
  );
}
