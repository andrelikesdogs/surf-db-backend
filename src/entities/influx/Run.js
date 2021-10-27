const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");
const Map = require("./Map.js");

class Run extends Model {}
Run.init(
  {
    runid: { type: DataTypes.INTEGER, primaryKey: true },
    mapid: {
      type: DataTypes.INTEGER,
      references: {
        model: Map,
        key: "mapid",
      },
    },
    rundata: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    modelName: "inf_runs",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Run;
