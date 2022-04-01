const express = require("express");
const router = new express.Router(),
  User = require("../model/User"),
  { isValidCredentials, isCorrectPassword } = require("../middleware/auth"),
  log = console.log;

//* GET ------------------------------------------------------------------------------------------

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/admin", isValidCredentials, (req, res) => {
  res.render("register");
});

router.get("/home", isValidCredentials, (req, res) => {
  res.render("register");
});

router.get("/contact", isValidCredentials, (req, res) => {
  res.render("register");
});

//* POST -------------------------------------------------------------------------------------------
// user login with username and password
// if admin, redirect to admin page. else home page
router.post("/login", async (req, res) => {
  const body = req.body;
  const match = await isCorrectPassword(body, User).catch(err => log('/login isCorrectPassword() error'));

  if (match) res.send(`Logged in as ${body.username}`);
  else res.send("Email does not exist or password is incorrect.");
});

// user can sign up using username and password
// redirects to login page
router.post("/register", async (req, res) => {
  await User.registerUser(req.body).catch(err => {
    log('/register hashAndSave() error');
    res.send(`This username has already been registered.`);
  });
});

module.exports = { controller: router };