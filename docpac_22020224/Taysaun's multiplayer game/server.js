const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

var players = [];
var values = [];
var ids = [];

io.on("connection", (socket) => {
    console.log("new user connected");
    socket.emit("message", "Welcome to the chat");
    socket.broadcast.emit("message", "A new user has joined the chat");
    
    socket.on("newPlayer", (player) => {
        ids.push(socket.id);
        console.log(ids);
        players.push(player)
        if (players.length === 2) {
            io.emit("enough")
            players = [];
        }
    });



    socket.on("finish", (value) => {
        values.push(value);
        if (values.length === 2) {
            io.emit("compare")
            if (values[0] < values[1]) {
                io.to(ids[0]).emit("winner", "You Win!")
            } else {
                io.to(ids[0]).emit("winner", "You Lose!")
            }
            if (values[0] > values[1]){
                io.to(ids[1]).emit("winner", "You Win!")
            } else {
                io.to(ids[1]).emit("winner", "You Lose!")
            }
            values = [];
            ids = [];
        }
    });
});

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname + "/script.js");
})

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname + "/style.css");
});

http.listen(3000, (err)=>{
    if (err) {
        console.log(err)
    } else {
        console.log("server running on port 3000")
    }
})