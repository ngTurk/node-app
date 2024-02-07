const express = require("express");
const server = require("http").createServer();
const app = express();

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

process.on("SIGINT", () => {
  server.close(() => {
    shutDownDB();
  });
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

    db.run(
      `INSERT INTO visitors (count, time) VALUES (${numClients}, datetime('now'))`
    );

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

// /
//
//

const sqlite = require("sqlite3");
const db = new sqlite.Database(":memory");

db.serialize(() => {
  db.run("DROP TABLE IF EXISTS visitors");

  db.run(`
    CREATE TABLE visitors (
      count INTEGER,
      time TEXT
    );
  `);
});

const getCounts = () => {
  db.each("SELECT * FROM visitors", (err, row) => {
    console.log(row);
  });
};

const shutDownDB = () => {
  getCounts();
  db.close();
};
