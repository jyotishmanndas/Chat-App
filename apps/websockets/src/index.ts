import { WebSocketServer, WebSocket } from 'ws';
import jwt, { decode } from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

interface Users {
    ws: WebSocket
    rooms: string[]
    userId: string
}
const users: Users[] = [];

function checkUser(token: string): string | null {
    const decoded = jwt.verify(token, "12345");
    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
        return null;
    }
    return decoded.userId;
}

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if (!url) {
        return
    }

    const params = new URLSearchParams(url.split('?')[1]);
    const token = params.get('token');
    const userId = checkUser(token || "");

    if (!userId) {
        ws.close();
        return;
    }

    ws.on('message', function message(data) {
        const message = JSON.parse(data.toString())
        if (message.type === "join_room") {
            const roomId = message.roomId;
            const user = users.find(user => user.userId === userId)
            if (user && !user.rooms.includes(roomId)) {
                user.rooms.push(roomId)
                ws.send(JSON.stringify({ type: "joined_room", roomId }));
            }
        } else {
            ws.send(JSON.stringify({ type: "error", message: "Already joined room" }))
        };

        if (message.type === "leave_room") {
            const roomId = message.roomId;
            const user = users.find(user => user.userId === userId);
            if (user && user.rooms.includes(roomId)) {
                user.rooms = user.rooms.filter(room => room !== roomId);
                ws.send(JSON.stringify({ type: "left room", roomId }))
            }
        };

        if (message.type === "send_message") {
            const roomId = message.roomId;
            const text = message.text;

            users.forEach(user => {
                if (user.rooms.includes(roomId) && user.userId !== userId) {
                    user.ws.send(JSON.stringify({ type: "message", userId, text, roomId }))
                }
            })
        }
    });
});