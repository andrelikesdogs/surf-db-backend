const Map = require("../entities/influx/Map");
const MapDescription = require("../entities/garbage/MapDescription");
//const MapRating = require("../entities/garbage/MapRatings");
const MapTag = require("../entities/garbage/MapTag");
const MapVariant = require("../entities/garbage/MapVariant");

const getAllMaps = async () => {
  const records = await MapDescription.findAll({
    include: [
      { model: MapVariant, as: "variants" },
      { model: MapTag, as: "tags" },
      //{ model: MapRating, as: "ratings" },
    ],
  });
  //console.log(records.map((m) => m.toJSON()));

  return records;
};

const getInfluxMaps = async () => {
  const records = await Map.findAll({
    include: [
      {
        model: MapVariant,
        include: [{ model: MapDescription }],
      },
    ],
  });

  console.log(records.map((m) => m.toJSON()));
  return records;
};

module.exports = {
  getAllMaps,
  getInfluxMaps,
};
