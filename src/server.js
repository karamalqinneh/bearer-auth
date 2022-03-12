const express = require("express");
const notFoundHandler = require("./middleware/404");
const errorHandler = require("./middleware/500");
const authRoute = require("./auth/router");
const cors = require("cors");
// express app
const app = express();
app.use(cors());

// connect to sequelize & listen for requests
const start = (port) => {
  app.listen(port, () => console.log(`Running on Port ${port}`));
};

// middleware & static files

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("server is up and running");
});
app.use(authRoute);

app.use("*", notFoundHandler);
app.use(errorHandler);

module.exports = {
  app: app,
  start: start,
};
