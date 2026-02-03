import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";

// ----- TYPES -----
interface JoystickState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  collision: boolean;
}

// Extend WebSocket to include roomCode
interface RoomWebSocket extends WebSocket {
  roomCode?: string;
}

// ----- APP SETUP -----
const app = express();
app.use(cors());
app.use(express.json());

// ----- IN-MEMORY STORAGE -----
const rooms: Record<string, Set<RoomWebSocket>> = {};
const joystickStates: Record<string, JoystickState> = {};

// ----- UTILS -----
function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// ----- REST ENDPOINT -----
app.get("/create-room", (req, res) => {
  const code = generateRoomCode();
  rooms[code] = new Set();
  joystickStates[code] = { forward: false, backward: false, left: false, right: false, collision: false };
  res.json({ success: true, room: code });
});

// ----- WEBSOCKET SERVER -----
const wss = new WebSocketServer({ noServer: true });
const server = app.listen(8080, () => console.log("HTTP running on 8080"));

// Handle WebSocket upgrades
server.on("upgrade", (req, socket, head) => {
  const roomCode = ((req.url || "/").split("/")[1] || "").toUpperCase();

  if (!roomCode || !rooms[roomCode]) {
    socket.write(
      "HTTP/1.1 400 Bad Request\r\nContent-Type: application/json\r\nConnection: close\r\n\r\n" +
        JSON.stringify({ success: false, error: "Room does not exist" })
    );
    socket.destroy();
    return;
  }

  if (rooms[roomCode].size >= 3) {
    socket.write(
      "HTTP/1.1 403 Forbidden\r\nContent-Type: application/json\r\nConnection: close\r\n\r\n" +
        JSON.stringify({ success: false, error: "Room is full (max 3 players)" })
    );
    socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    const client = ws as RoomWebSocket;
    client.roomCode = roomCode;
    if (!rooms[roomCode]) return; 
    rooms[roomCode].add(client);
    wss.emit("connection", client, req);
  });
});

// ----- WEBSOCKET CONNECTION HANDLER -----
wss.on("connection", (socket: RoomWebSocket) => {
  const room = socket.roomCode!;
  // Send initial joystick state
  socket.send(JSON.stringify({ success: true, type: "state", payload: joystickStates[room] }));

  // Handle incoming messages
  socket.on("message", (msg: string) => {
    const data = JSON.parse(msg);
    if (data.type === "joystick" && rooms[room]) {
      joystickStates[room] = { ...joystickStates[room], ...data.payload };
      rooms[room].forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "state", payload: joystickStates[room] }));
        }
      });
    }
  });

  // Handle disconnects
  socket.on("close", () => {
    if (!rooms[room]) return;
    rooms[room].delete(socket);
    if (rooms[room].size === 0) {
      delete rooms[room];
      delete joystickStates[room];
    }
  });
});