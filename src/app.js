const Express = require("express");
const http = require("http");

const app = Express();
const httpServer = http.createServer(app);

module.exports = { app, httpServer };
