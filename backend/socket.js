const users = {};

export const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('register', async (username) => {
  const player = await Player.findOne({ username });
  users[socket.id] = { socketId: socket.id, username, ...player.toObject() };
  io.emit('users', Object.values(users));
});


    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      delete users[socket.id];
      io.emit('users', Object.values(users));
    });

    socket.on('startGame', (opponentId) => {
      socket.to(opponentId).emit('gameStarted', { opponent: users[socket.id] });
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
};

