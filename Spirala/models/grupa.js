const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize, DataTypes) {
  const Grupa = sequelize.define("Grupa", {
    naziv: Sequelize.STRING,
  });

  Grupa.findOrCreate({
    where: { naziv: "RMAgrupa1", PredmetId: 2 },
  });

  Grupa.findOrCreate({
    where: { naziv: "WTgrupa1", PredmetId: 1 },
  });

  Grupa.findOrCreate({
    where: { naziv: "WTgrupa2", PredmetId: 1 },
  });

  return Grupa;
};
