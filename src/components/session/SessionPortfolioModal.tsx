import { Spinner } from "@/components/Loading";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchPortfolioSessions } from "@/store/portfolioReducer";
import Dialog from "@/components/modals/Dialog";
import PortfolioSessionsTable from "./SessionPortfolioTable";

interface PortfolioSessionsModalProps {
  open: boolean;
  onClose: () => void;
  portfolioId: string;
}

export default function PortfolioSessionsModal({
  open,
  onClose,
  portfolioId,
}: PortfolioSessionsModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const sessions =
    useSelector(
      (state: RootState) =>
        state.portfolio.portfolios.data.find((p) => p.id === portfolioId)
          ?.sessions
    ) || [];

  const loading = useSelector(
    (state: RootState) => state.portfolio.sessionLoading
  );

  useEffect(() => {
    if (open) {
      dispatch(fetchPortfolioSessions(portfolioId));
    }
  }, [dispatch, portfolioId, open]);

  return (
    <Dialog title="Visualizações" onClose={onClose} open={open}>
      <div className="w-[500px] p-5">
        {sessions.length > 0 ? (
          <PortfolioSessionsTable sessions={sessions} />
        ) : loading ? (
          <Spinner />
        ) : (
          <span className="text-center mt-10">
            Nenhuma visualização até o momento
          </span>
        )}
      </div>
    </Dialog>
  );
}
