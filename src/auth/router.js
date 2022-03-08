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
  let newToken = jwt.sign({ username: req.body.username }, SECRET);
  let newUser = {
    username: req.body.username,
    password,
    token: newToken,
  };
  let user = await User.create(newUser);
  res.status(201).json(user);
}

async function signinHandler(req, res) {
  res.status(200).json({ username: req.authorizedUser });
}

async function membersOnlyHandler(req, res) {
  let users = await User.findAll();
  res.status(200).json(users);
}

module.exports = router;
