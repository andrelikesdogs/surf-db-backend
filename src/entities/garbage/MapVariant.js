const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");
const Map = require("../influx/Map.js");
const MapDescription = require("./MapDescription.js");

class MapVariant extends Model {}
MapVariant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    descriptionid: {
      type: DataTypes.INTEGER,
      references: {
        Model: MapDescription,
        key: "descriptionid",
      },
    },
    name: { type: DataTypes.STRING },
    mapid: {
      type: DataTypes.INTEGER,
      references: {
        Model: Map,
        key: "mapid",
      },
    },
    game: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "garbage_map_variants",
    createdAt: false,
    updatedAt: false,
  }
);

MapDescription.hasMany(MapVariant, {
  foreignKey: "descriptionid",
  as: "variant",
});
MapVariant.belongsTo(MapDescription, {
  foreignKey: "descriptionid",
  as: "description",
});

module.exports = MapVariant;
