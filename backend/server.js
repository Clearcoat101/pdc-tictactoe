// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { connectDB } from "./config/db.js";
import authRoutes from './backend/routes/auth.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Use authentication routes
app.use('/api/auth', authRoutes);

// Socket.IO for real-time communication
const users = {};

io.on('connection', (socket) => {
    socket.on('register', (username) => {
        users[socket.id] = username;
        io.emit('users', Object.values(users));
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
        io.emit('users', Object.values(users));
    });

    // Handle game initiation
    socket.on('startGame', (data) => {
        socket.to(data.opponentId).emit('gameStarted', { opponent: users[socket.id] });
    });

    // WebRTC signaling
    socket.on('webrtc_offer', (data) => {
        socket.to(data.target).emit('webrtc_offer', {
            offer: data.offer,
            sender: socket.id,
        });
    });

    socket.on('webrtc_answer', (data) => {
        socket.to(data.target).emit('webrtc_answer', {
            answer: data.answer,
            sender: socket.id,
        });
    });

    socket.on('webrtc_ice_candidate', (data) => {
        socket.to(data.target).emit('webrtc_ice_candidate', {
            candidate: data.candidate,
            sender: socket.id,
        });
    });
});