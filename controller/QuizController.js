const express = require("express");
const router = new express.Router(),
  { Quiz, Question, Choice } = require("../model/Quiz"),
  { isValidCredentials } = require("../middleware/auth"),
  log = console.log;

router.get("/quiz/:quizId", isValidCredentials, (req, res) => {
  res.render("register");
});

router.post("/quiz/:quizId", isValidCredentials, (req, res) => {
  res.render("register");
});


module.exports = { controller: router };
