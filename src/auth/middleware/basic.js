const base64 = require("base-64");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const errorHandler = require("../../middleware/500");

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
  // next(errorHandler);
}

module.exports = basicAuth;
// (User) => (req, res, next) => {
//   if (req.headers["authorization"]) {
//     let basicHeaderParts = req.headers.authorization.split(" ");
//     console.log("basicHeaderParts >>> ", basicHeaderParts);
//     let encodedPart = basicHeaderParts.pop(); //encoded(username:password)
//     console.log("encodedPart >>> ", encodedPart);
//     let decoded = base64.decode(encodedPart); //username:password
//     console.log("decoded >>> ", decoded);
//     let [username, password] = decoded.split(":"); //[username: password]
//     // console.log('username');

//     // let validUser =  UserModel.authenticateBasic(username,password);
//     // req.user = validUser;
//     // next();
//     console.log(typeof User);
//     User.authenticateBasic(username, password)
//       .then((validUser) => {
//         req.user = validUser;
//         next();
//       })
//       .catch((error) => next(`invalid user ${error}`));
//   }
// };
