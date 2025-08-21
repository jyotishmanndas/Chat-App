"use client";

import { useWebSocket } from "@/hooks/websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatInputSchema } from "@workspace/zod-validator/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";
import { ArrowUp } from "lucide-react";
import axios from "axios";

interface Message {
    message: string
    userId: string
    roomId: string
}

export default function ChatPage() {
    const { socket, isConnected } = useWebSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userId, setuserId] = useState("");
    const params = useParams();
    const roomId = params.roomId as string;

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!socket || !isConnected || !token) return;

        axios.get("http://localhost:3001/userProfile", {
            headers: { Authorization: token }
        })
            .then((res) => setuserId(res.data.user.id))
            .catch(() => toast.error("Failed to load profile. Please login again."));

        axios.get(`http://localhost:3001/chat/roommessage/${roomId}`, {
            headers: { Authorization: token }
        })
            .then((res) => setMessages(res.data))
            .catch(() => toast.error("Failed to fetch room messages."));

        try {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "join_room", roomCode: roomId }));
            }
        } catch (error) {
            toast.error("Failed to join chat room.");
        }

    }, [socket, isConnected, roomId]);

    useEffect(() => {
        if (!socket || !isConnected) return;

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "message") {
                setMessages(prev => [...prev, {
                    message: data.message,
                    roomId: data.roomId,
                    userId: data.userId
                }]);
            }
        };
    }, [socket, isConnected]);

    const form = useForm<z.infer<typeof chatInputSchema>>({
        resolver: zodResolver(chatInputSchema),
        defaultValues: {
            message: ""
        },
    });

    async function onSubmit(values: z.infer<typeof chatInputSchema>) {
        const token = localStorage.getItem("token");
        if (!socket || !isConnected || !token) return;

        try {
            await axios.post("http://localhost:3001/chat/createmessage", { slug: roomId, message: values.message }, { headers: { Authorization: token } })

            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "send_message", messageText: values.message, roomCode: roomId }));
            }
            form.reset()
        } catch (error) {
            console.log(error);
            toast.error("Failed to send message");
        }
    }

    const { isValid } = form.formState

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
                    </CardDescription>
                    <div className="flex items-center w-full h-14 bg-accent mt-4 rounded-md">
                        <div className="flex items-start justify-center px-5 py-2">
                            <p className="text-muted-foreground font-light">ROOM CODE: </p>
                            <span className="text-muted-foreground font-semibold ml-1">{roomId}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-64 rounded-md border border-neutral-800 p-4 overflow-y-auto bg-background">
                        {messages.length === 0 && (
                            <div className="flex items-center justify-center h-full">
                                <span className="text-muted-foreground">No messages yet</span>
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div
                                key={msg.message}
                                className={`mb-2 p-2 rounded-md max-w-fit ${msg.userId === userId
                                    ? "bg-blue-600 text-white ml-auto"
                                    : "bg-gray-700 text-white"
                                    }`}
                            >
                                {msg.message}
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-2">
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input className="w-full" placeholder="send message" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button className="h-9 w-9 rounded-full cursor-pointer" type="submit" disabled={!isValid}>
                                    <ArrowUp className="w-4 h-4" />
                                </Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}