const mongoose = require("../db");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  feedback: [String],
  rating: [Number]
});
const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");

module.exports = Feedback;