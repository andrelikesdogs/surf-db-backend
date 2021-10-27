const get = require("./get.js");

const { app } = require("../../app.js");
app.route("/auth/steam").get(get);
