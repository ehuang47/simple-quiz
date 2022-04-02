const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const isValidCredentials = function (req, res, next) {
  const vals = Object.values(req.body);
  for (let i = 0, len = vals.length; i < len; i++) {
    const val = vals[i];
    if (val.length < 4 || val.length > 20)
      return res.status(200).send({ err: 'Inputs need to be 4-20 characters long.' });
  }
  next();
};

const isCorrectPassword = async function (loginInfo, userModel) {
  const { username, password } = loginInfo;
  const user = await userModel.findOne({ username });
  // finding the user should result in array of size 1, and comparing password should return true
  // when true, we should set the current object id
  const success = user && await bcrypt.compare(password, user.password);
  if (success) currentUser = user;
  return success;
};

const genJWT = (info) => {
  return jwt.sign(info, process.env.JWT_KEY);
};

const checkJWT = (req, res, next) => {
  console.log(`GET ${req.url}`);
  try {
    const jwt_header = req.header("JWT");
    const token = jwt.verify(jwt_header, process.env.JWT_KEY);
    console.log(token);
    next();
  } catch (e) {
    console.log('Failed JWT verification');
    res.send({ err: "Your token has expired. Please log in.", redirect: "/" });
  }
};

const isLoggedIn = (req, res, next) => {
  if (currentUser) {
    if (!currentUser.isAdmin && req.url === "/admin") return res.render("home", { err: "Must be an admin to view the admin page." });
    next();
  } else res.render("login", { err: "Please log in to view this page." });
};
module.exports = { isValidCredentials, isCorrectPassword, genJWT, checkJWT, isLoggedIn };
