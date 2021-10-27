const { app } = require("../../app.js");
const get = require("./get.js");

app.route("/times").get(get);
