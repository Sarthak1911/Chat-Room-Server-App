const express = require("express");
const Joi = require("joi");
const {
  getMessages,
  createMessage,
  likeMessage
} = require("../services/messages");

const router = express.Router();

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
