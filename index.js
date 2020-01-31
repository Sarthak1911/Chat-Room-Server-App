const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const users = require("./routes/user");
const messages = require("./routes/message");

const app = express();

//Middlewares
app.use(express.json());
app.use("/api/users", users);
app.use("/api/messages", messages);

app.get("/", (req, res) => {
  res.send("Chat room API");
});

//MongoDB connection
mongoose
  .connect("mongodb://localhost/chat-room", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log(`Couldn't connect to MongoDB cause of ${err}`);
  });

//Listen for client requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
