const express = require("express");
const app = express();

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
  res.redirect("/");
});

module.exports = app;