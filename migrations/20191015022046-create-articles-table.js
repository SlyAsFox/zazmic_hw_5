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
  up: (queryInterface, Sequelize) => queryInterface.createTable('articles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INT
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false
    },
    author_id: {
      type: Sequelize.INT,
      references:{
        model: 'users',
        key: 'id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false
    },
    published_at: {
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
  down: ( queryInterface ) => queryInterface.dropTable('articles')
};
