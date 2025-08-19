import { WebSocketServer, WebSocket } from 'ws';
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    ws: WebSocket
    rooms: string[]
    userId: string
}
const users: User[] = [];

function checkUser(token: string): string | null {
    try {
        const decoded = jwt.verify(token, "12345");
        if (!decoded || typeof decoded !== "object" || !decoded.userId) {
            return null;
        }
        return decoded.userId;
    } catch (error) {
        return null;
    }
};

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return
    };

    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');
    const userId = checkUser(token || "");

    if (!userId) {
        ws.close();
        return;
    };

    const user: User = {
        ws,
        rooms: [],
        userId,
    };
    users.push(user);

    ws.on('message', function message(data) {
        try {
            const message = JSON.parse(data.toString());

            switch (message.type) {
                case "join_room": {
                    const roomId = message.roomCode; //payload.roomId
                    const user = users.find(user => user.ws === ws);
                    if (user && !user.rooms.includes(roomId)) {
                        user.rooms.push(roomId);
                        ws.send(JSON.stringify({ type: "joined_room", roomId }));
                    } else {
                        ws.send(JSON.stringify({ type: "error", message: "Already in this room" }));
                    }
                    break;
                };
                case "leave_room": {
                    const roomId = message.roomCode;
                    const user = users.find(user => user.ws === ws);
                    if (user && user.rooms.includes(roomId)) {
                        user.rooms = user.rooms.filter(room => room !== roomId);
                        ws.send(JSON.stringify({ type: "left_room", roomId }));
                    } else {
                        ws.send(JSON.stringify({ type: "error", message: "Not in this room" }));
                    }
                    break;
                }
                case "send_message": {
                    const roomId = message.roomCode;
                    const text = message.messageText;

                    // Send message to all users in the same room (except sender)
                    users.forEach(otherUser => {
                        if (otherUser.rooms.includes(roomId)) {     //&& otherUser.userId !== userId
                            otherUser.ws.send(JSON.stringify({
                                type: "message",
                                message: text,
                                roomId,
                                userId
                            }));
                        }
                    });
                    break;
                }
                default: {
                    ws.send(JSON.stringify({ type: "error", message: "Unknown message type" }));
                }
            }
        } catch (error) {
            console.error("Error processing message:", error);
            ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }));
        }
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for user ${userId}:`, error);
    });
});

console.log('WebSocket server running on port 8080');