var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);

var options = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  schema: {
    tableName: "garbage_sessions",
  },
};

var sessionStore = new MySQLStore(options);

module.exports = (app) => {
  app.use(
    session({
      key: "sessionCookie",
      secret: process.env.SESSION_SECRET,
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );
};
