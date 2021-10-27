const { app } = require("./app.js");

const apolloServer = require("./graphql.js");

//require("./api/times/index.js");
//require("./api/maps/index.js");
//require("./api/user/index.js");

process.once("SIGUSR2", function () {
  process.kill(process.pid, "SIGUSR2");
});

process.on("SIGINT", function () {
  // this is only called on ctrl+c, not restart
  console.log("exiting via ctrl+c");
  process.kill(process.pid, "SIGINT");
});

apolloServer.start().then(() => {
  apolloServer.applyMiddleware({ app });

  app.listen(8080, () => {
    console.log("exiting via restart");
    console.log("Listening on :8080");
    console.log(`GraphQL URL: ${apolloServer.graphqlPath}`);
  });
});
