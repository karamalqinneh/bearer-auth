const express = require("express");
const router = express.Router();
const basicAuth = require("../auth/middleware/basic");
const bearerAuth = require("../auth/middleware/bearer");
const { User } = require("../auth/models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET;

router.post("/signup", signupHandler);
router.post("/signin", basicAuth, signinHandler);
router.get("/membersonly", bearerAuth, membersOnlyHandler);

async function signupHandler(req, res) {
  let password = await bcrypt.hash(req.body.password, 5);
  let newToken = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
      data: req.body.username,
      algorithm: "RS256",
    },
    SECRET
  );
  let newUser = {
    username: req.body.username,
    password,
    token: newToken,
  };
  let user = await User.create(newUser);
  res.status(201).json({ id: user.username, token: user.token });
}

async function signinHandler(req, res) {
  let user = await User.findOne({ where: { username: req.validUsername } });
  console.log(req.validUsername);
  let newToken = jwt.sign({ username: req.validUsername }, SECRET);
  user.token = newToken;
  res.status(200).json({ id: user.username, token: user.token });
}

async function membersOnlyHandler(req, res) {
  let users = await User.findAll();
  res.status(200).json(users);
}

module.exports = router;
