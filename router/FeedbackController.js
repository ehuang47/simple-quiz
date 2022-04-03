const express = require("express");
const router = new express.Router(),
  Feedback = require("../model/Feedback"),
  { isLoggedIn } = require("../middleware/auth"),
  log = console.log;

router.get("/feedback", isLoggedIn, (req, res) => {
  res.render("feedback");
});

router.post("/feedback", isLoggedIn, async (req, res) => {
  // ! should escape text input, req.body.feedback
  if (currentUser.gaveFeedback) res.send({ err: "This account has already submitted feedback." });
  else {
    await Feedback.submitFeedback(req.body).catch(err => log("POST /feedback submitFeedback() error"));
    // currentUser.gaveFeedback = true;
    res.send({ success: "Your feedback has been submitted." });
  }
});
module.exports = { controller: router };