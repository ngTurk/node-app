const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(3000, () => console.log("Server started on port 3000"));

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", (ws) => {
  const numClients = wss.clients.size;
  console.log("Clients Connected", numClients);

  wss.brodcast(`Current Visitors ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome!");
    ws.on("close", () => {
      console.log("Connection Closed");
      wss.brodcast(`Current Visitors ${numClients}`);
    });
  }
});

wss.brodcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};
