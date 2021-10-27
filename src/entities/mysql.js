const { Sequelize } = require("sequelize");

const { MySQL } = require("../../secrets.json");
const sequelize = new Sequelize({
  database: MySQL.database,
  username: MySQL.username,
  password: MySQL.password,
  port: MySQL.port,
  dialect: "mysql",
});

//sequelize.sync();

module.exports = sequelize;
