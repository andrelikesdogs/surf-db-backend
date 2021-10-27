const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");
const Map = require("./Map.js");
const MapDescription = require("../garbage/MapDescription.js");
const MapVariant = require("../garbage/MapVariant.js");
const Run = require("./Run.js");
const User = require("./User.js");

class Time extends Model {}
Time.init(
  {
    uid: { type: DataTypes.INTEGER, primaryKey: true },
    mapid: {
      type: DataTypes.INTEGER,
      references: {
        model: Map,
        key: "mapid",
      },
    },
    runid: {
      type: DataTypes.INTEGER,
      references: {
        model: Run,
        key: "runid",
      },
    },
    mode: { type: DataTypes.INTEGER },
    style: { type: DataTypes.INTEGER },
    rectime: { type: DataTypes.DECIMAL },
    recdate: { type: DataTypes.DATEONLY },
    jump_num: { type: DataTypes.INTEGER },
  },
  {
    sequelize,
    modelName: "inf_times",
    createdAt: false,
    updatedAt: false,
  }
);
// Link Influx Entities
Time.hasOne(Map, { sourceKey: "mapid", foreignKey: "mapid", as: "map" });
Time.hasOne(User, { sourceKey: "uid", foreignKey: "uid", as: "user" });
Time.hasOne(Run, { sourceKey: "runid", foreignKey: "runid", as: "run" });

// Link Time <-> MapVariant <-> MapDescription
// Time.hasOne(MapDescription, {
//   through: MapVariant,
//   as: "map_description",
//   foreignKey: "mapid",
//   otherKey: "descriptionid",
//   sourceKey: "mapid",
//   targetKey: "id",
// });
// MapDescription.belongsToMany(Time, {
//   through: MapVariant,
//   foreignKey: "mapid",
//   otherKey: "mapid",
//   //foreignKey: "mapid",
//   otherKey: "mapid",
//   sourceKey: "id",
//   //targetKey: "mapid",
// });

Time.hasOne(MapVariant, {
  sourceKey: "mapid",
  foreignKey: "mapid",
  as: "variant",
});

// MapVariant.belongsTo(Time, { sourceKey: "mapid", foreignKey: "mapid" });
// MapVariant.belongsTo(MapDescription, {
//   sourceKey: "id",
//   foreignKey: "descriptionid",
// });

//Time.hasMany(MapVariant, { sourceKey: "mapid", foreignKey: "inf_mapid" });

module.exports = Time;
