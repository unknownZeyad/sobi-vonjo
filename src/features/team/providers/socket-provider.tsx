'use client'
import { useParams } from "next/navigation";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

const Context = createContext<{
  socket: WebSocket | null
}>({
  socket: null
});

export const useTeamSocket = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useTeamSocket must be used within a TeamSocketProvider");
  }
  return context;
};

export default function TeamSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { team: teamId } = useParams<{ team: string }>();
  const [socket, setSocket] = useState<null | WebSocket>(null);

  const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null);

  useLayoutEffect(() => {
    let ws: WebSocket;

    const connect = () => {
      ws = new WebSocket(`wss://c3g-dev.quantex-ai.com?team_name=${teamId}&app_name=c3g`);

      ws.onopen = () => {
        console.log(`TEAM SOCKET (${teamId}) CONNECTED`);
        setSocket(ws);
      };

      ws.onclose = () => {
        console.log(`TEAM SOCKET (${teamId}) DISCONNECTED - Reconnecting in 2s...`);
        setSocket(null);
        // reconnectTimeoutRef.current = setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error(`TEAM SOCKET (${teamId}) ERROR:`, err);
        ws.close();
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
      setSocket(null);
    };
  }, [teamId]);


  return (
    <Context.Provider value={{ socket }}>
      {children}
    </Context.Provider>
  );
}
