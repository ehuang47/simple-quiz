const mongoose = require("../db");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  answers: [{ type: ObjectId, ref: "Choice" }],
  isAdmin: Boolean,
  gaveFeedback: Boolean
});
const User = mongoose.model("User", userSchema, "user");

const feedbackSchema = new Schema({
  feedback: [String],
  rating: [Number]
});
const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");

const quizSchema = new Schema({
  title: { type: String, required: true },
  questions: [{ type: ObjectId, ref: "Question" }],
});
const Quiz = mongoose.model("Quiz", quizSchema, "quiz");

const questionSchema = new Schema({
  question: { type: String, required: true },
  choices: [{ type: ObjectId, ref: "Choice" }],
  quiz: { type: ObjectId, ref: "Quiz" }
});
const Question = mongoose.model("Question", questionSchema, "question");

const choiceSchema = new Schema({
  choice: { type: String, required: true },
  question: { type: ObjectId, ref: "Question" },
  isCorrect: Boolean
});
const Choice = mongoose.model("Choice", choiceSchema, "choice");

module.exports = User;
