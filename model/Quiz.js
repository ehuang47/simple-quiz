const mongoose = require("../db");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  title: { type: String, enum: ['HTML', 'CSS', 'JS'], required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});
const Quiz = mongoose.model("Quiz", quizSchema, "quiz");

const questionSchema = new Schema({
  question: { type: String, required: true },
  choices: [String],
  correct: String
});
const Question = mongoose.model("Question", questionSchema, "question");

module.exports = { Quiz, Question };