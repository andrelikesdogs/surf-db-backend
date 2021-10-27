// tool to auto-create map variant versions with same name

const Map = require("../entities/influx/Map");
const MapDescription = require("../entities/garbage/MapDescription");
const MapVariant = require("../entities/garbage/MapVariant");
const sequelize = require("../entities/mysql");

const createVariantsIfNotExists = async () => {
  const mapDescriptions = await MapDescription.findAll({
    include: [
      { model: MapVariant, as: "variant" },
      //{ model: MapTag, as: "garbage_map_tags" },
      //{ model: MapRating, as: "ratings" },
    ],
  });

  const influxMaps = await Map.findAll({});

  const influxMapIdNameMap = influxMaps.reduce((o, map) => {
    o[map.mapname] = map.mapid;

    return o;
  }, {});

  const variantsToCreate = [];
  mapDescriptions.forEach((description) => {
    if (influxMapIdNameMap[description.name]) {
      variantsToCreate.push({
        mapid: influxMapIdNameMap[description.name],
        name: description.name,
        descriptionid: description.id,
        game: "CSS",
      });
    }
  });

  console.log(`Auto-Creating ${variantsToCreate.length} map variants`);
  //await Promise.all(
  //  variantsToCreate.map((variant) => MapVariant.create(variant))
  //);
  //sequelize.sync();
  console.log("Done");
};

createVariantsIfNotExists();
