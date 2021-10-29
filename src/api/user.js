const SteamID = require("steamid");
const Map = require("../entities/influx/Map");
const MapDescription = require("../entities/garbage/MapDescription");
const MapVariant = require("../entities/garbage/MapVariant");
const Time = require("../entities/influx/Time");
const User = require("../entities/influx/User");
const Run = require("../entities/influx/Run");
const sequelize = require("../entities/mysql");
const { Op } = require("sequelize");
const { ApolloError } = require("apollo-server-errors");

const formatSteamId = require("../utils/formatSteamId.js");

const getUserTimes = async (input) => {
  const steamId = formatSteamId(input);
  let steamIdInstance;
  try {
    if (steamId.length == 0) throw new Error("bad steamid");
    steamIdInstance = new SteamID(steamId);
  } catch (err) {
    console.error(err);
    throw new Error("Malformed SteamID");
  }

  const user = await User.findOne({
    where: {
      steamid: `${steamIdInstance.steam3()}`,
    },
  });

  if (!user) {
    throw new ApolloError("unknown user");
  }

  const completed = await Time.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            "(SELECT ranknumber\
            FROM (SELECT *, RANK() OVER (PARTITION BY `t`.`mapid`, `t`.`runid`, `t`.`mode`, `t`.`style` ORDER BY `t`.`rectime` ASC) as ranknumber FROM `inf_times` AS `t`) AS `t`\
            WHERE `t`.`uid`= `inf_times`.`uid` AND `t`.`mapid`= `inf_times`.`mapid` AND  `t`.`runid`= `inf_times`.`runid` AND  `t`.`mode`= `inf_times`.`mode` AND  `t`.`style`= `inf_times`.`style` \
            )"
          ),
          "rank",
        ],
        [
          sequelize.literal(
            "(SELECT rankcount\
              FROM (SELECT *, COUNT(*) as rankcount FROM `inf_times` GROUP BY `mapid`, `runid`, `mode`, `style`) AS `t2`\
              WHERE `t2`.`uid`= `inf_times`.`uid` AND `t2`.`mapid`= `inf_times`.`mapid` AND  `t2`.`runid`= `inf_times`.`runid` AND  `t2`.`mode`= `inf_times`.`mode` AND  `t2`.`style`= `inf_times`.`style` \
            )"
          ),
          "rankcount",
        ],
        // TODO total players for this map
      ],
    },
    // attributes: {
    //   include: [
    //     sequelize.literal(`
    //       (SELECT RANK() OVER (PARTITION BY times.uid ORDER BY times.rectime) FROM inf_times as times WHERE times.mapid = inf_times.mapid AND times.runid = inf_times.runid AND times.mode = inf_times.mode AND times.style = inf_times.style) AS timerank
    //     `),
    //   ],
    // },
    include: [
      { model: User, as: "user", foreignKey: "uid" },
      { model: Map, as: "map", foreignKey: "mapid" },
      {
        model: Run,
        on: {
          runid: sequelize.where(
            sequelize.col("`run`.`runid`"),
            "=",
            sequelize.col("`inf_times`.`runid`")
          ),
          mapid: sequelize.where(
            sequelize.col("`run`.`mapid`"),
            "=",
            sequelize.col("`inf_times`.`mapid`")
          ),
        },
        as: "run",
      },
      {
        model: MapVariant,
        as: "variant",
        include: [
          {
            model: MapDescription,
            as: "description",
          },
        ],
      },
    ],
    where: {
      "$user.steamid$": `${steamIdInstance.steam3()}`,
    },
    order: [[sequelize.col("inf_times.recdate"), "DESC"]],
  });

  // console.log(completed.map((c) => c.toJSON()));

  return {
    completed: completed.map((c) => c.toJSON()),
    records: completed.map((c) => c.toJSON()).filter((c) => c.rank === 1),
    user: {
      ...user.toJSON(),
      completedCount: completed.length,
      recordCount: completed.filter((c) => c.toJSON().rank === 1).length,
    },
  };
};

module.exports = {
  getUserTimes,
};
