const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize, DataTypes) {
  const Dan = sequelize.define("Dan", {
    naziv: Sequelize.STRING,
  });

  return Dan;
};
