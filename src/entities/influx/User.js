const { Model, DataTypes } = require("sequelize");
const sequelize = require("../mysql.js");

class User extends Model {}
User.init(
  {
    uid: { type: DataTypes.INTEGER, primaryKey: true },
    steamid: {
      type: DataTypes.STRING,
    },
    name: { type: DataTypes.STRING },
    joindate: { type: DataTypes.DATEONLY },
  },
  {
    sequelize,
    modelName: "inf_users",
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = User;
