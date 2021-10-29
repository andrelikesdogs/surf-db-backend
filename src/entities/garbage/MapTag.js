const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");
const MapDescription = require("./MapDescription.js");

class MapTag extends Model {}
MapTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    descriptionid: {
      type: DataTypes.INTEGER,
      references: {
        Model: MapDescription,
        key: "id",
      },
    },
    tag: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "garbage_map_tags",
    createdAt: false,
    updatedAt: false,
  }
);

MapDescription.hasMany(MapTag, {
  sourceKey: "id",
  foreignKey: "descriptionid",
  as: "tags",
});
MapTag.belongsTo(MapDescription, {
  sourceKey: "descriptionid",
  foreignKey: "id",
});

module.exports = MapTag;
