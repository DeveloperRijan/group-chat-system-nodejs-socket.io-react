const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});

// Store the active rooms and their users
const rooms = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected');
  // Join a chat room
  socket.on('joinRoom', ({ groupId, username }) => {
    socket.join(groupId);
    // Create the room if it doesn't exist
    if (!rooms[groupId]) {
      rooms[groupId] = {
        messages: []
      };
    }
    // Send existing messages in the room to the newly joined user
    const messages = rooms[groupId].messages;
    socket.emit('loadMessages', messages);
  });

  // Receive and broadcast messages
  socket.on('chatMessage', ({ groupId, message }) => {
    console.log(`Received message: ${message}`);
    // Store the message in the room's messages array
    rooms[groupId].messages = [message,...rooms[groupId].messages];
    // Broadcast the message to everyone in the room
    io.to(groupId).emit('message',message);
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const port = 4001;

http.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
