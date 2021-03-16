const Sequelize = require("sequelize");
const sequelize = require("../baza.js");

module.exports = function (sequelize, DataTypes) {
  const Student = sequelize.define("Student", {
    ime: Sequelize.STRING,
    index: Sequelize.STRING,
  });

  Student.findOrCreate({
    where: { ime: "Neko Nekić", index: "12345" },
  });

  Student.findOrCreate({
    where: { ime: "Četvrti Neko", index: "18009" },
  });

  return Student;
};
