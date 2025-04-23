import { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import { io, Socket } from "socket.io-client";
import { Spinner } from "../Loading";
import { useAuth } from "@/auth";
import { Typography, Button } from "@mui/joy";

interface ImobziModalProps {
  open: boolean;
  onClose: () => void;
}

interface SyncMessage {
  step: string;
  image?: string;
  done?: boolean;
  error?: string;
}

export default function ImobziModal({ open, onClose }: ImobziModalProps) {
  const [currentMessage, setCurrentMessage] = useState<SyncMessage | null>(
    null
  );
  const [infoMessages, setInfoMessages] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (!open || !auth.user?.id) return;

    const socket: Socket = io(import.meta.env.PUBLIC_ENV__API_URL, {
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket conectado");
    });

    socket.on("sync:progress", (data: SyncMessage) => {
      if (
        data.step.includes("encontrados") ||
        data.step.includes("finalizada")
      ) {
        setInfoMessages((prev) => [...prev, data.step]);
      } else {
        setCurrentMessage(data);
      }

      if (data.done) {
        setIsSyncing(false);
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [open, auth.user?.id]);

  const handleStartSync = () => {
    if (socketRef.current && auth.user?.id) {
      setInfoMessages([]);
      setCurrentMessage(null);
      setIsSyncing(true);
      socketRef.current.emit("joinSync", auth.user.id);
      socketRef.current.emit("startSync", auth.user.id); // precisa estar implementado no backend
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Importar do Imobzi"
      width={600}
    >
      <div className="p-4 flex flex-col gap-4 min-h-[280px] h-[400px] w-[500px] overflow-y-auto justify-center">
        {infoMessages.map((msg, idx) => (
          <div key={idx} className="text-sm text-grayText font-medium mb-10">
            ✅ {msg}
          </div>
        ))}

        {currentMessage && (
          <div className="flex flex-col items-center gap-3 text-sm min-h-[200px]">
            {currentMessage.image && (
              <img
                src={currentMessage.image}
                alt="foto"
                className="w-24 h-24 rounded object-cover"
              />
            )}
            <Typography>{currentMessage.step}</Typography>
          </div>
        )}

        {isSyncing && <Spinner />}

        {!isSyncing && (
          <Button
            onClick={handleStartSync}
            color="primary"
            variant="solid"
            size="md"
            className=""
          >
            Iniciar sincronização
          </Button>
        )}

        <small className="text-gray mt-2 text-center">
          *O Imobzi limita 2 requisições por segundo
        </small>
      </div>
    </Dialog>
  );
}
