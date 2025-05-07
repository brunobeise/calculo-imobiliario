import { Spinner } from "@/components/Loading";
import { IconButton, Typography, Divider } from "@mui/joy";
import { useEffect, useState } from "react";
import {
  IoIosArrowBack,
  IoIosArrowForward,
} from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Session } from "@/types/sessionTypes";
import { caseService } from "@/service/caseService";
import SessionsTable from "./SessionTable";

interface SessionsDrawerProps {
  caseId: string;
}

export default function SessionsDrawer({ caseId }: SessionsDrawerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(() => window.innerWidth > 1600);
  const [sessions, setSessions] = useState<Session[]>([]);

  const loading = useSelector(
    (state: RootState) => state.proposals.sessionLoading
  );

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 1800);
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

        <div className="px-5 overflow-y-auto h-[80%] pt-5">
          {loading ? (
            <div className="flex items-center h-full">
              <Spinner />
            </div>
          ) : (
            <SessionsTable sessions={sessions} />
          )}
        </div>
      </div>
    </>
  );
}
