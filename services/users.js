const bcrypt = require("bcryptjs");

const User = require("../models/user");

async function createUser(newUser) {
  const { username, password } = newUser;

  let user = new User({
    username: username.trim(),
    password: password,
    createdOn: new Date()
  });

  return await user.save();
}

async function getUser(id) {
  const user = await User.findById(id)
    .select("-password")
    .select("-__v");

  return user ? user : null;
}

async function loginUser(user) {
  const { username, password } = user;

  const usr = await User.findOne({ username: username });

  if (!usr) return;

  const isValidPassword = await bcrypt.compare(password, usr.password);

  if (!isValidPassword) return;

  return usr;
}

module.exports = { createUser, loginUser, getUser };
