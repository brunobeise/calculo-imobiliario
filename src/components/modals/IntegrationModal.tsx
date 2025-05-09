import { useEffect, useRef, useState } from "react";
import Dialog from "./Dialog";
import { io, Socket } from "socket.io-client";
import { Spinner } from "../Loading";
import { useAuth } from "@/auth";
import { Typography, Button } from "@mui/joy";

interface IntegrationModalProps {
  open: boolean;
  onClose: () => void;
}

interface SyncMessage {
  step: string;
  image?: string;
  done?: boolean;
  error?: string;
  propertyNames?: string[];
}

export default function IntegrationModal({
  open,
  onClose,
}: IntegrationModalProps) {
  const [currentMessage, setCurrentMessage] = useState<SyncMessage | null>(
    null
  );
  const [infoMessages, setInfoMessages] = useState<string[]>([]);
  const [propertyNames, setPropertyNames] = useState<string[]>([]);
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
      if (data.propertyNames) {
        setPropertyNames(data.propertyNames);
      }

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
      setPropertyNames([]);
      setIsSyncing(true);
      socketRef.current.emit("joinSync", auth.user.id);
      socketRef.current.emit("startSync", auth.user.id);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Importar do ${auth.user.imobzi ? "Imobzi" : "Jetimob"}`}
      width={600}
    >
      <div className="p-4 flex flex-col gap-4 min-h-[280px] h-[400px] w-[500px] overflow-y-auto justify-center">
        {infoMessages.map((msg, idx) => (
          <div key={idx} className="text-sm text-grayText font-medium">
            ✅ {msg}
          </div>
        ))}

        {currentMessage && (
          <div className="flex flex-col items-center gap-3 text-sm">
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

        {!isSyncing && propertyNames.length > 0 && (
          <div className="mt-4">
            <Typography level="title-sm" className="mb-2">
              🏡 Imóveis sincronizados:
            </Typography>
            <ul className="list-disc list-inside text-sm max-h-40 overflow-y-auto">
              {propertyNames.map((name, idx) => (
                <li key={idx}>{name}</li>
              ))}
            </ul>
          </div>
        )}

        <Button
          onClick={
            isSyncing
              ? undefined
              : isSyncing === false && propertyNames.length > 0
              ? onClose
              : handleStartSync
          }
          color={isSyncing ? "neutral" : "primary"}
          variant="solid"
          size="md"
          disabled={isSyncing}
        >
          {isSyncing
            ? "Sincronizando..."
            : propertyNames.length > 0
            ? "Concluir"
            : "Iniciar sincronização"}
        </Button>
      </div>
    </Dialog>
  );
}
