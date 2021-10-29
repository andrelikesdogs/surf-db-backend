const Express = require("express");
const http = require("http");
const cookieParser = require("cookie-parser");

const app = Express();
require("./session")(app);
app.use(cookieParser());

const httpServer = http.createServer(app);

const passport = require("passport");
const { Strategy } = require("passport-steam");

const ROLES = {
  "76561197975988124": "ADMIN",
};

const getUserState = (identifier) => {
  const steamId = identifier.match(/\d+$/)[0];
  const role = ROLES[steamId];

  return {
    identifier,
    steamId,
    role,
  };
};

passport.use(
  new Strategy(
    {
      returnURL: `${process.env.HOST_URL}/auth/return`,
      realm: `${process.env.HOST_URL}`,
      apiKey: process.env.STEAM_API_KEY,
    },
    (identifier, profile, done) => {
      const user = getUserState(identifier);
      done(null, user);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.identifier);
});

passport.deserializeUser(function (identifier, done) {
  const user = getUserState(identifier);
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/auth", passport.authenticate("steam"));
app.get("/auth/return", passport.authenticate("steam"), (req, res) => {
  if (req.user) {
    res.cookie(
      "userState",
      { loggedIn: "true", steamId: req.user.steamId, role: req.user.role },
      { maxAge: 1000 * 60 * 60 * 60 * 24 * 14 }
    );
    res.redirect(`/stats/${req.user.steamId}`);
  } else {
    res.redirect("/failed");
  }
});

app.get("/auth/logout", function (req, res) {
  req.logout();
  res.clearCookie("userState");
  res.redirect(req.get("Referer") || "/");
});

module.exports = { app, httpServer };
