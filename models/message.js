const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);

const messageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  username: { type: String, required: true },
  date: { type: Date, default: Date.now },
  likes: [String]
});

const Message = new mongoose.model("Message", messageSchema);

module.exports = Message;
