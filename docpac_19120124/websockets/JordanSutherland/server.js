const io = require('socket.io')(3000, {
  cors: {
      origin: "*",  // Allow requests from all origins
      methods: ["GET", "POST"]
  }
})

const users = {};
let date = new Date();

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
  });

  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', {date: date, message : message, name: users[socket.id]});
  });
 
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id]);
    delete users[socket.id];
  });
});