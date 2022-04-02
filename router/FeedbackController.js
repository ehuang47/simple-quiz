const express = require("express");
const router = new express.Router(),
  Feedback = require("../model/Quiz"),
  { isValidCredentials } = require("../middleware/auth"),
  log = console.log;

router.get("/feedback", isValidCredentials, (req, res) => {
  res.render("register");
});

router.post("/feedback", isValidCredentials, (req, res) => {
  res.render("register");
});
module.exports = { controller: router };