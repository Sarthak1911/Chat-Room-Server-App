const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token)
    return res.status(401).json({ error: "Authentication token not provided" });

  try {
    const decoded = jwt.verify(token, config.get("jwtPvtKey"));
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid token" });
  }
}

module.exports = auth;
