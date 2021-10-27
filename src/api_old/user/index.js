const stats_get = require("./stats_get.js");

const { app } = require("../../app.js");
app.route("/user/:steamId/stats").get(stats_get);
