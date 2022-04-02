const mongoose = require("mongoose");
const uri = process.env.DB_URI;
global.currentUser = null;
global.quizzes = null;
mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
},
  (error, data) => {
    // if (error) log(error);
    // else console.log("mongodb connected successfully");
  }
);

module.exports = mongoose;
