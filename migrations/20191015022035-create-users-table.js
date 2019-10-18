'use strict';

/**
 *@typedef {import('sequelize').Sequelize} Sequelize
 *@typedef {import('sequelize').QueryInterface} QueryInterface
 */

module.exports = {
  /**
   * @param queryInterface
   * @param Sequelize
   * @returns {Promise<void>}
   */
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INT
    },
    first_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false
    }
  }, { logging: console.log }),

  /**
   * @param queryInterface
   * @param Sequelize
   * @returns
   */
  down: ( queryInterface ) => queryInterface.dropTable('users')
};
