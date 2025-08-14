import { useEffect, useState } from "react"

export function useWebSocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No authentication token found");
            return;
        }

        const socketUrl = new WebSocket(`ws://localhost:8080?token=${token}`);

        socketUrl.onopen = () => {
            console.log("WebSocket connected successfully");
            setSocket(socketUrl);
            setIsConnected(true);
        };

        socketUrl.onclose = () => {
            console.log("WebSocket disconnected");
            setSocket(null);
            setIsConnected(false);
        };

        socketUrl.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
        };

        return () => {
            console.log("Cleaning up WebSocket connection");
            socketUrl.close();
        }
    }, []);

    return { socket, isConnected };
};