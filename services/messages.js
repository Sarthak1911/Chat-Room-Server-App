const Message = require("../models/message");

async function getMessages() {
  return await Message.find().sort({ date: -1 });
}

async function createMessage(messageObj) {
  const { message, username } = messageObj;

  let msg = new Message({
    message,
    username,
    like: [],
    date: new Date()
  });

  msg = await msg.save();

  return msg;
}

async function likeMessage(id, username) {
  const message = await Message.findById(id);

  if (!message) return;

  if (message.username === username) return "SAME";

  if (message.likes.includes(username)) return "ALREADY";

  message.likes.push(username);

  return await message.save();
}

module.exports = { getMessages, createMessage, likeMessage };
