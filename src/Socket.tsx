import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./auth";
import { toast } from "react-toastify";

interface WebSocketContextType {
  socket: Socket | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return;
    }

    const newSocket = io(import.meta.env.PUBLIC_ENV__API_URL, {
      query: { userId: auth.user.id },
      transports: ["websocket"],
    });

    newSocket.on("new_case_session", (data) => {
      toast.info(`${data.message} - ${data.caseName}`, {
        position: "top-right",
        autoClose: false,
        closeOnClick: true,
        draggable: true,
        pauseOnHover: true,
        hideProgressBar: true,
      });
    });

    setSocket(newSocket);
  }, [auth.isAuthenticated, auth.user.id]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Hook personalizado para consumir o WebSocket
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
