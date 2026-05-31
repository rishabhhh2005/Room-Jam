const http = require("http");
const WebSocket = require("ws");
const yws = require("y-websocket/bin/utils");
const url = require("url");

const PORT = parseInt(process.env.PORT, 10) || 1234;

// roomKey -> Map(userId -> banExpiry)
const bannedUsers = new Map();

const server = http.createServer((req, res) => {
  if (req.url === "/health" || req.url === "/ping") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found");
});

const wss = new WebSocket.Server({ noServer: true });

const BAN_DURATION = 5 * 60 * 1000; // 5 minutes

wss.on("connection", (ws, req) => {
  const parsedUrl = url.parse(req.url, true);
  const roomName = parsedUrl.pathname.slice(1);
  const userId = parsedUrl.query.userId;

  if (userId && roomName) {
    const roomBans = bannedUsers.get(roomName);
    if (roomBans && roomBans.has(userId)) {
      const expiry = roomBans.get(userId);
      if (Date.now() < expiry) {
        ws.close(4001, "You are temporarily banned from this room.");
        return;
      } else {
        roomBans.delete(userId);
      }
    }
  }

  // Handle custom messages
  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data);
      if (message.type === "kick") {
        const { targetId, roomKey } = message;
        
        // Add to ban list
        if (!bannedUsers.has(roomKey)) {
          bannedUsers.set(roomKey, new Map());
        }
        bannedUsers.get(roomKey).set(targetId, Date.now() + BAN_DURATION);

        // Disconnect the target user if they are connected
        wss.clients.forEach((client) => {
          const clientUrl = url.parse(client.upgradeReq?.url || "", true);
          const clientUserId = clientUrl.query.userId;
          const clientRoom = clientUrl.pathname.slice(1);
          
          if (clientUserId === targetId && clientRoom.startsWith(roomKey)) {
            client.send(JSON.stringify({ type: "kicked", message: "You have been removed from this room." }));
            client.close(4002, "Kicked by admin");
          }
        });

        // Broadcast kick notification to others
        wss.clients.forEach((client) => {
           if (client.readyState === WebSocket.OPEN) {
             const clientUrl = url.parse(client.upgradeReq?.url || "", true);
             const clientRoom = clientUrl.pathname.slice(1);
             if (clientRoom.startsWith(roomKey)) {
                client.send(JSON.stringify({ 
                  type: "notification", 
                  content: `A user was kicked from the room.`,
                  category: "kick"
                }));
             }
           }
        });
      }
    } catch (e) {
      // Not a JSON message, let y-websocket handle it if it's binary
    }
  });

  // Inject upgradeReq for later use if needed (some versions of ws don't keep it)
  ws.upgradeReq = req;

  yws.setupWSConnection(ws, req);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, () => {
  console.log(`Realtime collaboration server running on port ${PORT}`);
});
