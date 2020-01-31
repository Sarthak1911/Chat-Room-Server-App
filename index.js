require("express-async-errors");
const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

const users = require("./routes/user");
const messages = require("./routes/message");
const error = require("./middleware/error");

const app = express();

if (!config.get("jwtPvtKey")) {
  console.log("FATAL EXCEPTION - AUTH SERVICE NOT FUNCTIONING");
  process.exit(1);
}

//Middlewares
app.use(express.json());
app.use("/api/users", users);
app.use("/api/messages", messages);

app.get("/", (req, res) => {
  res.send("Chat room API");
});

//MongoDB connection
mongoose
  .connect(config.get("connectionString"), {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => {
    console.log(`Couldn't connect to MongoDB cause of ${err}`);
  });

app.use(error);

//Listen for client requests
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
