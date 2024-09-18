const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const Message = require('./models/message'); // Ensure this imports correctly
// const mongoConfig = require('./config/mongo'); // If not used, remove or adjust as needed

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/prac7', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Ensure Message model uses the correct collection name
const MessageSchema = new mongoose.Schema({
  user: String,
  content: String,
  timestamp: Date
});

// const Message = mongoose.model('Message', MessageSchema, 'socket_data'); // Use correct collection name

// Serve static files (client side)
app.use(express.static(__dirname + '/../client'));

io.on('connection', (socket) => {
  console.log('New client connected');

  // Send existing messages from MongoDB to the newly connected client
  Message.find().then((messages) => {
    socket.emit('initialMessages', messages);
  });

  // Handle incoming messages
  socket.on('sendMessage', (messageData) => {
    const newMessage = new Message({
      user: messageData.user,
      content: messageData.content,
      timestamp: new Date()
    });

    newMessage.save().then(() => {
      // Broadcast the message to all clients
      io.emit('message', newMessage);
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


