const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");
const MapDescription = require("./MapDescription.js");

class MapRating extends Model {}
MapRating.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    mapid: {
      type: DataTypes.INTEGER,
      references: {
        Model: MapDescription,
        key: "id",
      },
    },
    rating: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    modelName: "garbage_map_ratings",
    createdAt: "createdOn",
    updatedAt: false,
  }
);

MapDescription.hasMany(MapRating, {
  sourceKey: "id",
  foreignKey: "mapid",
});

MapRating.belongsTo(MapDescription, {
  sourceKey: "mapid",
  foreignKey: "id",
});

module.exports = MapRating;
