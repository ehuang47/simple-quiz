const bcrypt = require("bcryptjs");

const isValidCredentials = function (req, res, next) {
  const vals = Object.values(req.body);
  for (let i = 0, len = vals.length; i < len; i++) {
    const val = vals[i];
    if (val.length < 4 || val.length > 20)
      return res.send(`Inputs need to be 4-20 characters long.`);
  }
  next();
};

const isCorrectPassword = async function (loginInfo, userModel) {
  const { username, plaintext } = loginInfo;
  const user = await userModel.findOne({ username });
  // finding the user should result in array of size 1, and comparing password should return true
  // when true, we should set the current object id
  const success = user.length && (await bcrypt.compare(plaintext, user.password));
  if (success) currentUID = user._id;
  return success;
};

module.exports = { isValidCredentials, isCorrectPassword };
