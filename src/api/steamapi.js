const { ApolloError } = require("apollo-server-errors");
const SteamAPI = require("steamapi");
const SteamID = require("steamid");
const NodeCache = require("node-cache");

const SteamApiCache = new NodeCache({ stdTTL: 3600 * 24 });

const api = new SteamAPI(process.env.STEAM_API_KEY);

const getProfileSummary = async (steamId) => {
  let steamIdInstance;
  try {
    steamIdInstance = new SteamID(steamId);
  } catch (err) {
    throw new ApolloError("invalid steamid");
  }

  if (SteamApiCache.has(steamId)) {
    return SteamApiCache.get(steamId);
  }

  const result = await api.getUserSummary(steamIdInstance.getSteamID64());

  if (result) SteamApiCache.set(steamId, result);

  return result;
};

module.exports = {
  getProfileSummary,
};
