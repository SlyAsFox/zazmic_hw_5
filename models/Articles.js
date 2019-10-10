const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class Articles extends Model {}

Articles.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
    },
    authorId: {
        type: DataTypes.INTEGER,
        field: 'author_id'
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
    },
    publishedAt: {
        type: DataTypes.DATE,
        field: 'published_at'
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
    },

},{
    sequelize,
    modelName: 'articles',
    underscored: true
});

Articles.associate = ( models ) => {
    Articles.belongsTo(models.Users, {
        as: 'author',
        foreignKey: 'authorId'
    })
};

module.exports = Articles;