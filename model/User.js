const bcrypt = require("bcryptjs");
const mongoose = require("../db");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  results: [{
    id: String,
    title: {
      type: String,
      enum: ['General', 'Food', 'Christmas']
    },
    questions: [{
      question: String,
      choices: [String],
      correct: String,
      selection: String
    }],
    score: Number,
    start: String,
    end: String
  }],
  isAdmin: Boolean,
  gaveFeedback: Boolean
});


userSchema.statics.registerUser = async (body) => {
  const user = new User(body);
  user.password = await bcrypt.hash(body.password, 10);
  user.isAdmin = false;
  user.gaveFeedback = false;
  return await user.save();
};

const User = mongoose.model("User", userSchema, "user");




module.exports = User;
