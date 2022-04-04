const express = require("express");
const app = express();
const { getUser } = require("./middleware/auth");

const routeController = function (name) {
  const { controller } = require(`./router/${name}Controller`);
  app.use(controller);
};

app.set("view engine", "hbs");

app.use(express.json());
routeController("User");
routeController("Quiz");
routeController("Feedback");

// when no routes match
app.use(function (req, res) {
  // if the user is logged in, they should be redirected to home if regular user, admin if admin, and login page if not logged in
  try {
    const user = getUser(req);
    if (user.isAdmin) res.redirect("/admin");
    else res.redirect("/home");
  } catch (e) {
    res.redirect("/");
  }
});

module.exports = app;