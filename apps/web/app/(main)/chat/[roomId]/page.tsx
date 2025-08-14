"use client";

import { useWebSocket } from "@/hooks/websocket";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inputSchema } from "@workspace/zod-validator/zod";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@workspace/ui/components/form";

interface Message {
    id: string;
    text: string;
    userId: string;
    roomId: string;
}

export default function ChatPage() {

    const form = useForm<z.infer<typeof inputSchema>>({
        resolver: zodResolver(inputSchema),
        defaultValues: {
            text: ""
        },
    });

    function onSubmit(values: z.infer<typeof inputSchema>) {
        console.log(values)
    }

    const params = useParams();
    const roomId = params.roomId as string;

    const { socket, isConnected } = useWebSocket();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (!socket || !isConnected) {
            return;
        };

        console.log("WebSocket connected, joining room:", roomId);
        // Join the room
        socket.send(JSON.stringify({ type: "join_room", roomId }));
    }, [socket, isConnected, roomId]);

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
                            <span className="text-muted-foreground font-light ml-1">{roomId}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full h-64 rounded-md border border-neutral-800 p-4 overflow-y-auto bg-background">
                        {/* to diaplay a messages */}
                    </div>

                    <div className="mt-5 w-full">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center w-full gap-2">
                                <FormField
                                    control={form.control}
                                    name="text"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input className="w-full" placeholder="send message" {...field} />
                                            </FormControl>
                                            {/* <FormMessage /> */}
                                        </FormItem>
                                    )}
                                />
                                <Button className="h-9 w-9 rounded-full cursor-pointer" type="submit">S</Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}