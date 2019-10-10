const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL || 'mysql://nikita:n5GnXn7bRYEckfzJ@35.222.76.188:3306/nikita', {
    dialect: 'mysql',
    logging: console.log,
    benchmark: true
});

module.exports = sequelize;