const express = require("express");
const router = new express.Router(),
  { Quiz } = require("../model/Quiz"),
  { isLoggedIn } = require("../middleware/auth"),
  log = console.log;

let results = null;

/* 
todo: on clicking quiz link, randomly select 10 questions and render. on submit quiz, calculate data, store the results in var. upload to db and redirect to get/quiz/results. this checks if results are null. if so, redirect to home page and say please take quiz. otherwise, render quiz results and send back. then nullify results var
 */

router.get("/quiz/:title", (req, res) => {
  const indices = new Set();
  while (indices.size < 10) {
    const r = Math.floor(Math.random() * 20);
    indices.add(r);
  }

  const questions = [];
  for (const quiz of quizzes) {
    if (quiz.title === req.params.title) {
      for (const index of indices) {
        questions.push(quiz.questions[index]);
      }
      break;
    }
  }
  res.render("quiz", { questions, title: req.params.title });
});

router.post("/quiz", (req, res) => {
  res.render("register");
});


module.exports = { controller: router };
