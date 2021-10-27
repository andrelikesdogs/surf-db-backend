//const InfluxMapRecord = require("../../entities/influx/Map.js");

const Time = require("../../entities/influx/Time");
const Map = require("../../entities/influx/Map");
const User = require("../../entities/influx/User");

const get = async (req, res) => {
  console.log(req.params);
  const records = await Time.findAll({
    include: [
      { model: Map, as: "map" },
      { model: User, as: "user", required: true },
    ],
    where: {
      "$user.steamid$": `[${req.params.steamId}]`,
    },
    order: [["rectime", "desc"]],
    group: [
      "inf_times.mapid",
      "inf_times.runid",
      "inf_times.mode",
      "inf_times.style",
    ],
  });

  res.json(records);
};

module.exports = get;
