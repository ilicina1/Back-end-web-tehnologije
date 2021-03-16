const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize, DataTypes) {
  const Tip = sequelize.define("Tip", {
    naziv: Sequelize.STRING,
  });

  return Tip;
};
