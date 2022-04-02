const mongoose = require("../db");
const Schema = mongoose.Schema;

const quizSchema = new Schema({
  title: { type: String, enum: ['General', 'Food', 'Christmas'], required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
});
const Quiz = mongoose.model("Quiz", quizSchema, "quiz");

const questionSchema = new Schema({
  question: String,
  choices: [String],
  correct: String
});
const Question = mongoose.model("Question", questionSchema, "question");

module.exports = { Quiz, Question };