const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");

const { createUser, loginUser, getUser } = require("../services/users");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await getUser(req.user._id);

  user
    ? res.status(200).json(user)
    : res.status(404).json({ error: "User not found" });
});

router.post("/register", async (req, res) => {
  const { error } = Joi.validate(req.body, {
    username: Joi.string().required(),
    password: Joi.string()
      .required()
      .min(6)
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  let { username, password } = req.body;

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);

  try {
    const user = await createUser({ username, password });
    const token = user.generateAuthToken();

    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .status(200)
      .json({ username: user.username, _id: user._id });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Username is already taken" });
    } else {
      throw Error(error);
    }
  }
});

router.post("/login", async (req, res) => {
  const { error } = Joi.validate(req.body, {
    username: Joi.string().required(),
    password: Joi.string()
      .required()
      .min(6)
  });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const loggedInUser = await loginUser(req.body);

  if (!loggedInUser) {
    res.status(400).json({ error: "Invalid username or password" });
    return;
  }

  const token = loggedInUser.generateAuthToken();

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .status(200)
    .json({ _id: loggedInUser._id, username: loggedInUser.username });
});

module.exports = router;
