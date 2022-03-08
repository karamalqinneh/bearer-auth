const server = require("./src/server");
require("dotenv").config();
const { database } = require("./src/auth/models/index");

database.sync().then(() => {
  server.start(process.env.PORT || 5050);
});
