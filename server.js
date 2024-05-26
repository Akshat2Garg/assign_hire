// server.js

const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketio(server);

connectDB();

app.use(express.json({ extended: false }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

io.on('connection', (socket) => {
    console.log('New WS Connection...');

    socket.on('join', ({ userId }) => {
        socket.join(userId);
        console.log(`User ${userId} joined`);
    });

    socket.on('sendMessage', ({ senderId, receiverId, message }) => {
        io.to(receiverId).emit('message', { senderId, message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
