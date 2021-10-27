const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");
const MapVariant = require("../garbage/MapVariant.js");

class Map extends Model {}
Map.init(
  {
    mapid: { type: DataTypes.INTEGER, primaryKey: true },
    mapname: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "inf_maps",
    createdAt: false,
    updatedAt: false,
  }
);

//Map.belongsTo(MapVariant);
//MapVariant.hasOne(Map);

module.exports = Map;
