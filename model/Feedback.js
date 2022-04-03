const mongoose = require("../db");
const Schema = mongoose.Schema;
const User = require("../model/User");

const feedbackSchema = new Schema({
  rating: Number,
  feedback: String
});

feedbackSchema.statics.submitFeedback = async (body) => {
  const fb = new Feedback(body);
  // console.log(fb);
  await fb.save();
  return await User.findByIdAndUpdate(currentUser._id, { gaveFeedback: false });
};

const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");
module.exports = Feedback;