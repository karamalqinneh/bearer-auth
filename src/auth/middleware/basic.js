const errorHandler = require("../../middleware/500");

const { User } = require("../models/index");
const base64 = require("base-64");
const bcrypt = require("bcrypt");

async function basicAuth(req, res, next) {
  if (req.headers["authorization"]) {
    let basicHeaderParts = req.headers.authorization.split(" ");
    let encodedPart = basicHeaderParts.pop();
    let decoded = base64.decode(encodedPart);
    let [username, password] = decoded.split(":");
    console.log(await User.findOne({ where: { username: username } }));
    const user = await User.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      req.validUsername = username;
      next();
    } else {
      next(errorHandler);
    }
  }
  next(errorHandler);
}

module.exports = basicAuth;
