import { Spinner } from "@/components/Loading";
import { Session } from "@/types/sessionTypes";
import {
  Modal,
  ModalDialog,
  Typography,
  Table,
  IconButton,
  Sheet,
} from "@mui/joy";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCaseSessions } from "@/store/caseReducer";

interface CaseSessionsModal {
  open: boolean;
  onClose: () => void;
  caseId: string;
}

function SessionRow(props: {
  session: Session;
  openSessionId: number | null;
  setOpenSessionId: (id: number | null) => void;
}) {
  const { session, openSessionId, setOpenSessionId } = props;
  const isOpen = openSessionId === session.id;

  const handleToggle = () => {
    setOpenSessionId(isOpen ? null : session.id);
  };

  const pageTitles = [
    "Introdução",
    "Entenda o cálculo",
    "Divisão do capital",
    "Explicação valor presente",
    "Reinvestimento do Lucro Mensal",
    "Análise Gráfica Detalhada",
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

        <td>{session.sessionTime}s</td>
        <td>{dayjs(session.createdAt).format("DD/MM/YYYY - HH:mm:ss")}</td>
      </tr>
      {isOpen && (
        <tr>
          <td colSpan={3} style={{ padding: 0 }}>
            <Sheet
              variant="soft"
              sx={{
                p: 1,
                pl: 1,
                boxShadow: "inset 0 3px 6px 0 rgba(0 0 0 / 0.08)",
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
                  {Array.from({ length: 6 }, (_, i) => i + 1).map((page) => (
                    <tr key={`page${page}`}>
                      <td>{pageTitles[page - 1]}</td>{" "}
                      <td>{session[`page${page}TimeVisible`] + "s" || "??"}</td>
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

export default function CaseSessionsModal(props: CaseSessionsModal) {
  const dispatch = useDispatch<AppDispatch>();
  const [openSessionId, setOpenSessionId] = useState<number | null>(null);
  const sessions =
    useSelector(
      (state: RootState) =>
        state.cases.myCases.find((c) => c.id === props.caseId)?.sessions
    ) || [];
  const loading = useSelector((state: RootState) => state.cases.sessionLoading);

  useEffect(() => {
    if (props.open) {
      dispatch(fetchCaseSessions(props.caseId));
    }
  }, [dispatch, props.caseId, props.open]);

  return (
    <Modal onClose={props.onClose} open={props.open}>
      <ModalDialog
        variant="outlined"
        role="dialog"
        aria-labelledby="sessions-case-modal"
        className="h-[500px] overflow-y-auto"
        sx={{ width: { xs: "90%", sm: 500 } }}
      >
        <>
          <Typography className="text-center" level="h4">
            Visualizações
          </Typography>
          {sessions.length > 0 ? (
            <Table aria-label="session table">
              <thead>
                <tr>
                  <th style={{ width: 40 }} aria-label="empty" />

                  <th>Tempo de sessão</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <SessionRow
                    key={session.id}
                    session={session}
                    openSessionId={openSessionId}
                    setOpenSessionId={setOpenSessionId}
                  />
                ))}
              </tbody>
            </Table>
          ) : loading ? (
            <>
              <Spinner />
            </>
          ) : (
            <span className="font-bold text-center mt-10">
              Nenhuma visualização até o momento :(
            </span>
          )}
        </>
      </ModalDialog>
    </Modal>
  );
}