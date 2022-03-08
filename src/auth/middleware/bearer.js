const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;
const { User } = require("../models/index");

const bearerAuth = async (req, res, next) => {
  if (req.headers["authorization"]) {
    let bearerHeaderParts = req.headers.authorization.split(" ");
    console.log("bearerHeaderParts >>> ", bearerHeaderParts);
    let token = bearerHeaderParts.pop();
    const parsedToken = jwt.verify(token, SECRET);
    console.log(parsedToken);
    const user = await User.findOne({
      where: { username: parsedToken.username },
    });
    const test = await User.findOne({
      where: { username: parsedToken.username },
    });
    if (test) {
      req.authorizedUser = user;
      next();
    } else {
      res.status(500).send("please login again");
    }
  }
};
module.exports = bearerAuth;
