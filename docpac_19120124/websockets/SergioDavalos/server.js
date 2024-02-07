const express = require('express')
const app = express()
const { Server } = require('socket.io')

const port = 3000;
app.set('view engine', 'ejs')


app.use(express.static('views'))

app.get('/', (req, res) => {
    res.render('index')
})
const expressServer = app.listen(3000)
const io = new Server(expressServer, {
    cors: {
        origin: "*",  // Allow requests from all origins
        methods: ["GET", "POST"]
    }

})
const users = {}

io.on('connection', socket => {
    socket.on('new-user', name => {
        users[socket.id] = name
        socket.broadcast.emit('user-connected', name)


    })
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
    })
    socket.on('chat-message', data => {
        appendMessage(`${data.name} at ${data.timestamp}: ${data.message}`)
    })
    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})