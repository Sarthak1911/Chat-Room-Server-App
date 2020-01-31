function error(err, req, res, next) {
  res.status(500).send("Something went wrong at the server.");
}

module.exports = error;
