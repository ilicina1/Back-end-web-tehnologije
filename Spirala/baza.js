const Sequelize = require("sequelize");
const sequelize = new Sequelize("bwt2024st", "root", "password", {
   host: "localhost",
   dialect: "mysql",

   pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
});

module.exports = sequelize;
