import { Spinner } from "@/components/Loading";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCaseSessions } from "@/store/caseReducer";
import Dialog from "@/components/modals/Dialog";
import SessionsTable from "./SessionTable";

interface CaseSessionsModal {
  open: boolean;
  onClose: () => void;
  caseId: string;
}

export default function CaseSessionsModal(props: CaseSessionsModal) {
  const dispatch = useDispatch<AppDispatch>();
  const sessions =
    useSelector(
      (state: RootState) =>
        state.proposals.myCases.find((c) => c.id === props.caseId)?.sessions
    ) || [];
  const loading = useSelector(
    (state: RootState) => state.proposals.sessionLoading
  );

  useEffect(() => {
    if (props.open) {
      dispatch(fetchCaseSessions(props.caseId));
    }
  }, [dispatch, props.caseId, props.open]);

  return (
    <Dialog title="Visualizações" onClose={props.onClose} open={props.open}>
      <div className="w-[500px] p-5">
        {sessions.length > 0 ? (
          <SessionsTable sessions={sessions} />
        ) : loading ? (
          <>
            <Spinner />
          </>
        ) : (
          <span className="text-center mt-10">
            Nenhuma visualização até o momento
          </span>
        )}
      </div>
    </Dialog>
  );
}
