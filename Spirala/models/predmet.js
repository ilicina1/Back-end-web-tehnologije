const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize, DataTypes) {
  const Predmet = sequelize.define("Predmet", {
    naziv: Sequelize.STRING,
  });

  Predmet.findOrCreate({
    where: { naziv: "WT" },
  });

  Predmet.findOrCreate({
    where: { naziv: "RMA" },
  });

  return Predmet;
};
