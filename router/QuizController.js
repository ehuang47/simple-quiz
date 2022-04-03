const express = require("express");
const router = new express.Router(),
  User = require("../model/User"),
  { isLoggedIn } = require("../middleware/auth"),
  log = console.log;
const { v4: uuidv4 } = require('uuid');

let results = null;
let readyResults = false;

router.get("/quiz/results", isLoggedIn, (req, res) => {
  // readyResults checks against users trying to access results when they havent submitted a quiz
  if (readyResults) {
    res.render("results", { results, name: `${currentUser.firstName} ${currentUser.lastName}` });
    readyResults = false;
  } else res.render("home");
});

router.get("/quiz/:title", isLoggedIn, (req, res) => {
  // generate unique 0-19 to select quiz questions
  const indices = new Set();
  while (indices.size < 10) {
    const r = Math.floor(Math.random() * 20);
    indices.add(r);
  }

  // iterate through numbers to extract question list
  const questions = [];
  for (const quiz of quizzes) {
    if (quiz.title === req.params.title) {
      for (const index of indices) {
        const { question, choices, correct } = quiz.questions[index];
        questions.push({ question, choices, correct, selection: '' });
      }
      break;
    }
  }

  // start building results for inserting into db & loading results page
  results = { id: '', title: req.params.title, questions, score: 0, start: 0, end: 0 };
  res.render("quiz", { questions, title: req.params.title });
});

//* POST -------------------------------------------------------------------------------------------
router.post("/quiz", isLoggedIn, async (req, res) => {
  // tag user selections as correct/incorrect, store them in results, and sum total correct
  const { selections, start, end } = req.body, questions = results.questions;
  let score = 0;
  for (let i = 0; i < 10; i++) {
    const question = questions[i], selected = selections[i];
    if (question.correct === selected) {
      score++;
      question.selection = `Correct: ${selected}`;
    } else question.selection = `Incorrect: ${selected}`;
  }

  // store test duration & score
  results.id = uuidv4();
  results.score = score;
  results.start = start;
  results.end = end;
  log(results.id, results.score, results.start, results.end);

  // storing results so that admin can check them later
  await User.findByIdAndUpdate(currentUser._id, { $push: { results: results } }).catch(err => log("POST /quiz findByIdAndUpdate() error\n", err));

  /*
  ! this can be used if you dont want to store previous attempts
  const user = await User.findById(currentUser._id).catch(err => log("POST /quiz findById error"));
  const curResults = user.results;
  // check if user has old results for this quiz. if so, remove it and append new results
  let previouslyTaken = curResults.some(res => { return res.title === results.title; });
  if (previouslyTaken) {
    const newResults = curResults.filter(res => { return res.title !== results.title; });
    newResults.push(results);
  }
  await User.findByIdAndUpdate(currentUser._id, { results: newResults }).catch(err => log("POST /quiz findByIdAndUpdate() error"));
  */


  // redirect to new page to display results and set flag for it being ready
  readyResults = true;
  res.send({ redirect: "/quiz/results" });
});


module.exports = { controller: router };
