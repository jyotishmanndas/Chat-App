"use client";

import { useWebSocket, getCurrentUser } from "@/hooks/websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";

interface Message {
    id: string;
    text: string;
    // userId: string;
    // timestamp: Date;
    isOwn: boolean;
}

interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function ChatPage() {
    const params = useParams();
    const roomId = params.roomId as string;

    const { socket, isConnected } = useWebSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Fetch current user information
    useEffect(() => {
        getCurrentUser().then(user => {
            setCurrentUser(user);
        });
    }, []);

    useEffect(() => {
        if (!socket || !isConnected) {
            return;
        }

        console.log("WebSocket connected, joining room:", roomId);

        // Join the room
        socket.send(JSON.stringify({ type: "join_room", roomId }));

        // Listen for messages
        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                console.log("Received WebSocket message:", data);

                switch (data.type) {
                    case "joined_room":
                        setIsJoined(true);
                        toast.success(`Joined room: ${data.roomId}`);
                        break;

                    case "message":
                        const newMessage: Message = {
                            id: Date.now().toString(),
                            text: data.text,
                            // userId: data.userName || data.userId || "Unknown",
                            // timestamp: new Date(),
                            isOwn: false
                        };
                        setMessages(prev => [...prev, newMessage]);
                        break;

                    case "error":
                        toast.error(data.message);
                        break;

                    default:
                        console.log("Unknown message type:", data.type);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        socket.addEventListener("message", handleMessage);

        return () => {
            socket.removeEventListener("message", handleMessage);
        };
    }, [socket, isConnected, roomId]);

    const sendMessage = () => {
        if (!inputMessage.trim() || !socket || !isJoined) {
            console.log("Cannot send message:", {
                hasInput: !!inputMessage.trim(),
                hasSocket: !!socket,
                isJoined
            });
            return;
        }

        const messageData = {
            type: "send_message",
            roomId,
            text: inputMessage.trim()
        };

        console.log("Sending message:", messageData);
        socket.send(JSON.stringify(messageData));

        // Add own message to the list
        const ownMessage: Message = {
            id: Date.now().toString(),
            text: inputMessage.trim(),
            // userId: currentUser?.name || "You",
            // timestamp: new Date(),
            isOwn: true
        };

        setMessages(prev => [...prev, ownMessage]);
        setInputMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Real Time Chat
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                    </CardTitle>
                    <CardDescription>
                        {isConnected ? "Connected to chat room" : "Connecting..."}
                        {currentUser && ` • Logged in as ${currentUser.name}`}
                    </CardDescription>
                    <div className="flex items-center w-full h-14 bg-accent mt-4 rounded-md">
                        <div className="flex items-start justify-center px-5 py-2">
                            <p className="text-muted-foreground font-light">ROOM CODE: </p>
                            <span className="text-muted-foreground font-light ml-1">{roomId}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-64 rounded-md border border-neutral-800 p-4 overflow-y-auto bg-background">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                {isJoined ? "No messages yet. Start the conversation!" : "Joining room..."}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${message.isOwn
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted'
                                                }`}
                                        >
                                            {/* <div className="text-sm font-medium mb-1">
                                                {message.userId}
                                            </div> */}
                                            <div className="text-sm">{message.text}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-5 flex gap-2">
                        <Input
                            className="flex-1"
                            placeholder="Type your message..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={!isJoined}
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!inputMessage.trim()}
                        >
                            Send
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}