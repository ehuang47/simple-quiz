const express = require("express");
const router = new express.Router(),
  Feedback = require("../model/Feedback"),
  { isLoggedIn, getUser } = require("../middleware/auth"),
  log = console.log;

router.get("/feedback", isLoggedIn, (req, res) => {
  res.render("feedback");
});

router.post("/feedback", isLoggedIn, async (req, res) => {
  // ! should escape text input, req.body.feedback
  const user = getUser(req);
  if (user.gaveFeedback) res.send({ err: "This account has already submitted feedback." });
  else {
    await Feedback.submitFeedback(req.body).catch(err => log("POST /feedback submitFeedback() error"));
    // user.gaveFeedback = true;
    res.send({ success: "Your feedback has been submitted." });
  }
});
module.exports = { controller: router };