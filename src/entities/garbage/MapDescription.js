const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");

class MapDescription extends Model {}
MapDescription.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    category: { type: DataTypes.STRING },
    tier: { type: DataTypes.INTEGER },
    stageCount: { type: DataTypes.INTEGER },
    bonusStageCount: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING },
    author: { type: DataTypes.STRING },
  },
  {
    sequelize,
    modelName: "garbage_map_descriptions",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = MapDescription;
