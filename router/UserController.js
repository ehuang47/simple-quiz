const express = require("express");
const router = new express.Router(),
  User = require("../model/User"),
  { Quiz } = require("../model/Quiz"),
  { isValidCredentials, isCorrectPassword, genJWT, isLoggedIn } = require("../middleware/auth"),
  log = console.log;

//* GET ------------------------------------------------------------------------------------------
// res.render("todo", { filename: filename, list: updatedTodos });

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/admin", isLoggedIn, (req, res) => {
  res.render("admin");
});

router.get("/home", async (req, res) => {
  if (!quizzes) quizzes = await Quiz.find().populate("questions").catch(err => log("GET /home Quiz.find() error"));
  const titles = [];
  for (const quiz of quizzes) {
    titles.push(quiz.title);
  }
  // todo if admin, render admin page which queries for all user data and results
  res.render("home", { titles: titles });
});

router.get("/contact", isLoggedIn, (req, res) => {
  res.render("contact");
});

//* POST -------------------------------------------------------------------------------------------
// user login with username and password
// if admin, redirect to admin page. else home page
router.post("/login", isValidCredentials, async (req, res) => {
  const body = req.body;
  const match = await isCorrectPassword(body, User)
    .catch(err => log('POST /login isCorrectPassword() error'));

  if (match) {
    res.setHeader('JWT', genJWT(body));
    if (currentUser.isAdmin) res.send({ redirect: "/admin" });
    else res.send({ redirect: "/home" });
  }
  else
    res.send({ err: "Username does not exist or password is incorrect." });

});

// user can sign up using username and password
// redirects to login page
router.post("/register", isValidCredentials, async (req, res) => {
  const user = await User.registerUser(req.body).catch(err => {
    log('POST /register hashAndSave() error');
  });

  if (user) res.status(201).send({ success: "Successfully registered." });
  else res.status(200).send({ err: "This username has already been registered." });
});

module.exports = { controller: router };
