const Map = require("../entities/influx/Map");
const MapDescription = require("../entities/garbage/MapDescription");
//const MapRating = require("../entities/garbage/MapRatings");
const MapTag = require("../entities/garbage/MapTag");
const MapVariant = require("../entities/garbage/MapVariant");

const getMaps = async () => {
  const records = await MapDescription.findAll({
    include: [
      { model: MapVariant, as: "variant" },
      { model: MapTag, as: "tags" },
      //{ model: MapRating, as: "ratings" },
    ],
  });
  //console.log(records.map((m) => m.toJSON()));

  return records.map((m) => m);
};

module.exports = {
  getMaps,
};
