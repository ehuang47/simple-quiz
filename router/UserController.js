const express = require("express");
const router = new express.Router(),
  User = require("../model/User"),
  Feedback = require("../model/Feedback"),
  { Quiz } = require("../model/Quiz"),
  { isValidCredentials, isCorrectPassword, genJWT, isLoggedIn } = require("../middleware/auth"),
  log = console.log;

let users = null, resultsMap = {};

//* GET ------------------------------------------------------------------------------------------

router.get("/register", (req, res) => res.render("register"));

// for when admin wants to navigate to user's quiz results breakdown
router.get("/admin/results/:id", isLoggedIn, (req, res) => {
  if (!currentUser.isAdmin) return res.redirect("/home");
  const [results, name] = resultsMap[req.params.id];
  res.render("results", { results, name });
});

// load all user data into memory and render the admin page
router.get("/admin", isLoggedIn, async (req, res) => {
  if (!currentUser.isAdmin) return res.redirect("/home");
  users = await User.find().catch(err => log("GET /admin User.find() error"));
  const feedback = await Feedback.find().catch(err => log("GET /admin Feedback.find() error"));
  let sum = 0;
  for (const fb of feedback) {
    sum += fb.rating;
  }

  res.render("admin", { users, feedback, average: (sum / feedback.length).toPrecision(3) });

  // store mapping of every user's result ID to their name and result for rendering purposes 
  for (const user of users) {
    const results = user.results;
    for (const result of results) {
      resultsMap[result.id] = [result, `${user.firstName} ${user.lastName}`];
    }
  }
});

// load all static quiz data into memory and render the home page
router.get("/home", isLoggedIn, async (req, res) => {
  if (!quizzes) quizzes = await Quiz.find().populate("questions").catch(err => log("GET /home Quiz.find() error"));
  const titles = [];
  for (const quiz of quizzes) {
    titles.push(quiz.title);
  }
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
router.post("/register", isValidCredentials, async (req, res) => {
  const user = await User.registerUser(req.body).catch(err => {
    log('POST /register hashAndSave() error');
  });

  if (user) res.status(201).send({ success: "Successfully registered.", redirect: "/" });
  else res.status(200).send({ err: "This username has already been registered." });
});

module.exports = { controller: router };
