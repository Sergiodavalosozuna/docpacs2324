const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let spawns = [[100, 100], [1700, 800]];
let coins = [{ x: 500, y: 500, radius: 10 }, { x: 1200, y: 700, radius: 15 }];

var numOfPlayers = 0;

var players = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    numOfPlayers = Object.keys(players).length;
    console.log(numOfPlayers);

    players[socket.id] = {
        playerId: socket.id,
        playerSocket: socket,
        x: spawns[numOfPlayers][0],
        y: spawns[numOfPlayers][1],
        radius: 20,
        keyW: false,
        keyA: false,
        keyS: false,
        keyD: false,
        score: 0
    };
});

// Set the view engine to
app.set('view engine', 'ejs');
// Serve static files from the "public"
app.use(express.static('public'));
// Render the index.ejs
app.get('/', (req, res) => {
    res.render('index');
});

// Socket.io
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('keydown', (data) => {
        if (data.key == 'w') {
            players[socket.id].keyW = true;
        } else if (data.key == 'a') {
            players[socket.id].keyA = true;
        } else if (data.key == 's') {
            players[socket.id].keyS = true;
        } else if (data.key == 'd') {
            players[socket.id].keyD = true;
        }
    });

    socket.on('keyup', (data) => {
        if (data.key == 'w') {
            players[socket.id].keyW = false;
        } else if (data.key == 'a') {
            players[socket.id].keyA = false;
        } else if (data.key == 's') {
            players[socket.id].keyS = false;
        } else if (data.key == 'd') {
            players[socket.id].keyD = false;
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        delete players[socket.id];
    });
});

// game loop
setInterval(step, 1000 / 60);

function step() {
    let tempPlayerList = {};

    // for every player, read their key presses and move them accordingly within borders
    for (var i in players) {
        let player = players[i];
        handlePlayerMovement(player);
        checkPlayerCollisions(player);
        checkPlayerCoinCollisions(player);

        // add the player to the temp player list
        tempPlayerList[player.playerId] = {
            x: player.x,
            y: player.y,
            playerId: player.playerId,
            score: player.score
        };
    }

    // for every player in the player list
    for (var i in players) {
        let player = players[i];
        // send the player's position and score to the client
        player.playerSocket.emit('update', { players: tempPlayerList, coins });
    }
}

function handlePlayerMovement(player) {
    if (player.keyW && player.y > 0) {
        player.y -= 3;
    }
    if (player.keyA && player.x > 0) {
        player.x -= 3;
    }
    if (player.keyS && player.y < 940) {
        player.y += 3;
    }
    if (player.keyD && player.x < 1875) {
        player.x += 3;
    }
}

function checkPlayerCollisions(player) {
    for (let i in players) {
        if (i !== player.playerId) {
            let otherPlayer = players[i];
            const distance = Math.sqrt(Math.pow(otherPlayer.x - player.x, 2) + Math.pow(otherPlayer.y - player.y, 2));

            if (distance <= player.radius + otherPlayer.radius) {
                // Handle collision between players
                console.log(`Collision detected between Player ${player.playerId} and Player ${otherPlayer.playerId}!`);
                // Add further actions when collision is detected
            }
        }
    }
}

function checkPlayerCoinCollisions(player) {
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        const distance = Math.sqrt(Math.pow(coin.x - player.x, 2) + Math.pow(coin.y - player.y, 2));

        if (distance <= player.radius + coin.radius) {
            console.log(`Player ${player.playerId} collected a coin!`);
            player.score++;
            coins.splice(i, 1);
            // Add further actions when collision is detected
        }
    }
}

// Start the server
http.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
