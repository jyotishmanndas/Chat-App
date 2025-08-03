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

export async function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    try {
        // Decode the JWT to get userId
        const parts = token.split('.');
        if (parts.length !== 3 || !parts[1]) {
            console.error('Invalid token format');
            return null;
        }
        
        const payload = JSON.parse(atob(parts[1]));
        const userId = payload.userId;

        const response = await fetch(`http://localhost:3000/${userId}`, {
            headers: {
                'Authorization': `${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return data.user;
        }
    } catch (error) {
        console.error('Error fetching current user:', error);
    }

    return null;
}