const { app } = require("../../app.js");
const get = require("./get.js");
const completed_get = require("./completed_get.js");

app.route("/maps").get(get);
app.route("/maps/completed_by/:steamId").get(completed_get);
