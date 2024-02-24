const express = require('express');
const http = require('http');
const Websocket = require('ws');
const path = require('path');

const port = 3000;
const app = express();
const server = http.createServer(app);
const wss = new Websocket.Server({ server });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile('index.html');
  });

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === Websocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
});

server.listen(port, function() {
    console.log(`Server is listening on ${port}!`);
});