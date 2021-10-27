const Map = require("../../entities/influx/Map.js");
const Time = require("../../entities/influx/Time.js");

const get = async (req, res) => {
  const times = await Time.findAll({ include: [Map] });

  return res.json(times);
};

module.exports = get;
