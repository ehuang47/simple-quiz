const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const activeUsers = {};

// for validating user input on registration
const isValidCredentials = function (req, res, next) {
  const vals = Object.values(req.body);
  for (let i = 0, len = vals.length; i < len; i++) {
    const val = vals[i];
    if (val.length < 4 || val.length > 20)
      return res.status(200).send({ err: 'Inputs need to be 4-20 characters long.' });
  }
  next();
};

// for validating user login input
const isCorrectPassword = async function (loginInfo, userModel) {
  const { username, password } = loginInfo;
  const user = await userModel.findOne({ username });
  // finding the user should result in array of size 1, and comparing password should return true
  // when true, we should set the current object id
  const success = user && await bcrypt.compare(password, user.password);
  if (success) activeUsers[user.username] = user;
  console.log(`${username} has logged in:`, activeUsers);

  return [success, user.isAdmin];
};

const genJWT = (info) => {
  return jwt.sign(info, process.env.JWT_KEY);
};

const getUser = (req) => {
  const token = req.headers.cookie.substring(4);
  const tokenData = jwt.verify(token, process.env.JWT_KEY);
  return activeUsers[tokenData.username];
};

const clearUser = (req) => {
  const username = getUser(req).username;
  delete activeUsers[username];
};

// for restricting access to login, registration, and random routes
const isNotLoggedIn = (req, res, next) => {
  try {
    const user = getUser(req);
    if (user.isAdmin) res.redirect("/admin");
    else res.redirect("/home");
  } catch (e) {
    next();
  }
};

// main authorization middleware for GET requests 
const isLoggedIn = (req, res, next) => {
  try {
    const user = getUser(req);

    // protecting all GET requests
    if (req.method === 'GET') {
      const isAdminUrl = req.url === "/admin",
        isAdminResultUrl = (req.url.length > 15 && req.url.substring(0, 15) === "/admin/results/"),
        isLoginUrl = req.url === "/",
        isRegisterUrl = req.url === "/register";

      if (isAdminUrl || isAdminResultUrl) {
        if (!user.isAdmin) return res.redirect("/home");
      } else {
        // admin user should logout at their page to go to non-admin routes
        if (user.isAdmin) return res.redirect("/admin");
        // if user tries to go back to login or register, redirect them to home, so they can logout
        else if (isLoginUrl || isRegisterUrl) return res.redirect("/home");
      }
    }
    // ? i would check for POST requests, but its probably enough to hide the display?

    next();
  } catch (e) {
    console.log('Failed JWT verification');
    res.render("login", { err: "Please log in to view this page." });
  }
};
module.exports = { isValidCredentials, isCorrectPassword, genJWT, isLoggedIn, isNotLoggedIn, getUser, clearUser };
