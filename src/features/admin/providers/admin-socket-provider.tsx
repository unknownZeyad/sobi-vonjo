"use client";

import { createContext, useContext, useLayoutEffect, useState, useRef } from "react";

const Context = createContext<{
    socket: WebSocket | null;
}>({
    socket: null!
});

export const useAdminSocket = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error("useAdminSocket must be used within an AdminSocketProvider");
    }
    return context;
};

export default function AdminSocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [socket, setSocket] = useState<null | WebSocket>(null);

    const reconnectTimeoutRef = useRef<NodeJS.Timeout>(null);

    useLayoutEffect(() => {
        let ws: WebSocket;

        const connect = () => {
            ws = new WebSocket(`wss://c3g-dev.quantex-ai.com?role=admin&app_name=c3g`);

            ws.onopen = () => {
                console.log('ADMIN SOCKET CONNECTED');
                setSocket(ws);
            };

            ws.onclose = () => {
                console.log('ADMIN SOCKET DISCONNECTED - Reconnecting in 2s...');
                setSocket(null);
            };

            ws.onerror = (err) => {
                console.error('ADMIN SOCKET ERROR:', err);
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
    }, []);

    return (
        <Context.Provider value={{ socket }}>
            {children}
        </Context.Provider>
    );
}
