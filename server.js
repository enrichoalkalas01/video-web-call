const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})
const cors = require('cors')
app.use(cors())

const port = 7000

io.on('connection', (socket) => {
    socket.emit('me', socket.id)

    // Disconnected
    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })

    // Call User
    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit(
            'callUser',
            { signal: data.signalData, from: data.from, name: data.name }
        )

        socket.on('answerCall', (data) => io.to(data.to).emit('callAccepted'), data.signal)
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${ port }`)
})