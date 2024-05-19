"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', function connection(ws, req) {
    ws.on('error', console.error);
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    ws.on('open', function open() {
        console.log('connected ');
        ws.send(Date.now());
    });
    console.log('Connected to url: ' + req.url);
    ws.send('something');
});
