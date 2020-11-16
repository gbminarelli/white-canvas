const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = require("./mime-lookup.js");
const WebSocket = require("ws");

const hostname = "127.0.0.1";
const port = 1337;

const readFile = (req, res, filename = req.url) => {
  fs.readFile(path.join(__dirname, "..", filename), (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.setHeader("Content-Type", mime.lookup(path.extname(filename)));
    res.writeHead(200);
    res.end(data);
  });
};

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  if (req.url === "/") {
    readFile(req, res, "index.html");
  } else {
    readFile(req, res);
  }
});

const wss = new WebSocket.Server({ server });
let colors = Array(49).fill("#ffffff");

wss.on("connection", (socket) => {
  console.log("Socket connected.");
  socket.on("close", () => {
    console.log("Socket disconnected.");
  });

  socket.on("message", (messageJSON) => {
    let message = JSON.parse(messageJSON);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (message.type === "open" && client === socket) {
          message.colors = colors;
          client.send(JSON.stringify(message));
        } else if (message.type === "click") {
          colors = message.colors;
          client.send(JSON.stringify(message));
        }
      }
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
