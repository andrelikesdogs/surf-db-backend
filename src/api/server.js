const { ApolloError } = require("apollo-server-errors");
const { query } = require("express");
const Gamedig = require("gamedig");
const NodeCache = require("node-cache");

const ServerQueryCache = new NodeCache({ stdTTL: 2 });

const SERVERS = {
  1: {
    type: "css",
    host: "garbagesurf_srcds_1",
    port: "27015",
  },
};

const getServerStatus = async (serverId) => {
  const server = SERVERS[serverId];
  if (!server) throw new ApolloError("Invalid ServerID");

  if (ServerQueryCache.has(serverId)) return ServerQueryCache.get(serverId);

  let queryResult;

  try {
    queryResult = await Gamedig.query({
      ...server,
      socketTimeout: 1000,
      attemptTimeout: 3000,
      listenUdpPort: 27001,
    });
  } catch (err) {
    console.warn(err);
  }

  let serverStatus;
  if (!queryResult) {
    serverStatus = { status: "OFFLINE" };
  } else {
    serverStatus = {
      status: "ONLINE",
      playerCount: queryResult.players.length,
      maxPlayerCount: queryResult.maxplayers,
      name: queryResult.name,
      map: queryResult.map,
      players: queryResult.players.map((player) => ({
        name: player.name,
        playTimeSeconds: player.raw.time,
      })),
    };
  }

  ServerQueryCache.set(serverId, serverStatus);

  return serverStatus;
};

module.exports = { getServerStatus };
