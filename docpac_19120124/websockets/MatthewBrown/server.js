const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server, {
  cors: {
    origin: "*",  // Allow requests from all origins
    methods: ["GET", "POST"]
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server listening on port 3000');
});

const users = {};

io.on('connection', socket => {
  socket.on('newUser', nameU => {
    users[socket.id] = nameU;
    socket.broadcast.emit('userConnected', nameU);
    io.emit('usersUpdated', Object.values(users));
  })
  socket.on('sendChatMessage', data => {
    socket.broadcast.emit('chatMessage', { message: data.message, nameU: users[socket.id], timeSent: data.timeSent });
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('userDisconnected', users[socket.id]);
    delete users[socket.id];
    io.emit('usersUpdated', Object.values(users));
  })
})
