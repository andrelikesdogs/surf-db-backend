const Map = require("../../entities/influx/Map");
const Time = require("../../entities/influx/Time");
const User = require("../../entities/influx/User");

const { Op } = require("sequelize");

const SteamID = require("steamid");

const get = async (req, res) => {
  const steamId = req.params.steamId;

  try {
    const id = new SteamID(steamId);

    if (!id.isValidIndividual()) {
      throw new Error("Invalid SteamID");
    }
  } catch (err) {
    throw new Error("Invalid SteamID");
  }

  // player records

  // 1. find all maps player completed
  // player completions
  const records = await Time.findAll({
    include: [
      { model: Map, as: "map" },
      { model: User, as: "user", required: true },
    ],
    where: {
      "$user.steamid$": `${steamId}`,
    },
    order: [["rectime", "desc"]],
    group: [
      "inf_times.mapid",
      "inf_times.runid",
      "inf_times.mode",
      "inf_times.style",
    ],
  });

  const targetUserId = records[0].uid;

  const mapIds = records.map((record) => record.mapid);
  const timesPerMap = await Time.findAll({
    include: [{ model: Map, as: "map" }],
    where: {
      mapid: {
        [Op.in]: mapIds,
      },
    },
    order: [
      ["mapid", "desc"],
      ["rectime", "asc"],
    ],
  });

  const completionsWithRank = Object.values(timesPerMap).reduce(
    (o, timeRecord) => {
      if (!o[timeRecord.mapid]) {
        o[timeRecord.mapid] = [];
      }

      const { map, ...entry } = timeRecord.toJSON();
      const rank = o[timeRecord.mapid].length + 1;
      o[timeRecord.mapid].push({
        ...entry,
        mapid: timeRecord.mapid,
        mapname: map.mapname,
        rank,
      });
      return o;
    },
    {}
  );

  const playerRecords = [];
  const playerCompletionMap = Object.keys(completionsWithRank).reduce(
    (o, mapId) => {
      let playersBestCompletion = null;
      for (let completion of completionsWithRank[mapId]) {
        if (completion.uid == targetUserId) {
          if (completion.rank === 1) playerRecords.push(completion);
          playersBestCompletion = completion;
          break;
        }
      }

      o[mapId] = playersBestCompletion;
      return o;
    },
    {}
  );

  const playerCompletions = Object.values(playerCompletionMap);

  const sortByRecdate = (a, b) => {
    const aDate = new Date(a["recdate"]).valueOf();
    const bDate = new Date(b["recdate"]).valueOf();

    return bDate - aDate;
  };

  res.send({
    completions: playerCompletions.sort(sortByRecdate),
    records: playerRecords.sort(sortByRecdate),
  });
};

module.exports = get;
