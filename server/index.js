import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors : {
        origin: 'http://localhost:5173',
        method: ["GET", "POST"],
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Route Page</h1>');
});

io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);
    // socket.emit('welcome', 'Welcome to the chat application')
    // socket.broadcast.emit('welcome', `${socket.id} has joined the chat`)

    io.use((socket, next) => {
        //socket middleware
        next();
    })

    socket.on('message', ({message, room}) => {
        console.log({room, message});
        // socket.broadcast.emit('recieve-message', data);
        socket.to(room).emit('recieve-message', message);
    })

    socket.on('join-room', (RoomName) => {
        socket.join(RoomName);
        console.log(`User joined ${RoomName}`)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected ', socket.id);
    })
});

server.listen(3000, () => {
    console.log('Server running on PORT 3000');
});
