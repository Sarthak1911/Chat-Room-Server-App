const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");

const router = express.Router();

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  username: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: [String]
});

const Message = new mongoose.model("Message", messageSchema);

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

router.get("/", async (req, res) => {
  const messages = await getMessages();
  res.status(200).json(messages);
});

router.post("/", async (req, res) => {
  const { error } = Joi.validate(req.body, {
    message: Joi.string().required(),
    username: Joi.string().required()
  });

  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  res.status(200).json(await createMessage(req.body));
});

router.put("/:id", async (req, res) => {
  const { username } = req.body;
  const { id } = req.params;

  const { error } = Joi.validate(req.body, {
    username: Joi.string().required()
  });

  if (error) {
    res.status(400).json(error.details[0].message);
    return;
  }

  const message = await likeMessage(id, username);

  if (!message) {
    res.status(404).json("Message not found");
    return;
  }

  if (message === "ALREADY") {
    res.status(400).json("Message already liked.");
    return;
  }

  if (message === "SAME") {
    res.status(400).json("User cannot like his/her message.");
    return;
  }

  res.status(200).json(message);
});

module.exports = router;
