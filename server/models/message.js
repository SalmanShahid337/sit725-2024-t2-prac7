const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  user: String,
  content: String,
  timestamp: Date
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
