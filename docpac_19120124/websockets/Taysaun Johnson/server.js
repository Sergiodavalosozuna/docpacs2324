const io = require('socket.io')(5000, {
    cors: {
        origin: "*",  // Allow requests from all origins
        methods: ["GET", "POST"]
    }
})

const users= {}

io.on('connection', socket => {
    socket.on('new-user', newName => {
        users[socket.id] = newName
        socket.broadcast.emit('user-connected', newName)
    })
    socket.on('send-chat-message', message => {
        var date = new Date()
        var time = date.toLocaleTimeString()
        socket.broadcast.emit('chat-message', { message: message, newName: users[socket.id], date: time})
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})