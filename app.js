const express = require("express");
const app = express();
const { engine } = require('express-handlebars');

const routeController = function (name) {
  const { controller } = require(`./router/${name}Controller`);
  app.use(controller);
};

// https://stackoverflow.com/questions/41423727/handlebars-registerhelper-serverside-with-expressjs
// https://stackoverflow.com/questions/69962757/typeerror-handlebars-is-not-a-function
app.engine('handlebars', engine({
  extname: '.hbs',
  helpers: require('./config//hbs-helpers')
}));
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