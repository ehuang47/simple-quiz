const bcrypt = require("bcryptjs");
const mongoose = require("../db");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  results: [{
    title: {
      type: String,
      enum: ['General', 'Food', 'Christmas']
    },
    questions: [{
      q: { type: Schema.Types.ObjectId, ref: "Question" },
      selection: String
    }],
    score: Number,
    duration: Number,
  }],
  isAdmin: Boolean,
  gaveFeedback: Boolean
});


userSchema.statics.registerUser = async (body) => {
  const user = new User(body);
  user.password = await bcrypt.hash(body.password, 10);
  await user.save();
};

// read: find shallow user, and full user (after populate)

// update: given object, update the user and save

const User = mongoose.model("User", userSchema, "user");




module.exports = User;
