const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, min: 6 },
  createdOn: { type: Date, required: true }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    { _id: this._id, username: this.username },
    config.get("jwtPvtKey")
  );

  return token;
};

const User = new mongoose.model("User", userSchema);

module.exports = User;
