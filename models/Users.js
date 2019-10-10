const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../sequelize');
const saltRounds = 10;

class Users extends Model {}

Users.init({
    firstName: {
        type: DataTypes.STRING,
        field: 'first_name',
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        field: 'last_name',
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        field: 'created_at',
        allowNull: false
    },
    updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at',
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'users',
    underscored: true,
    defaultScope: {
        attributes: {
            exclude: ['password']
        }
    }
});

Users.associate = ( models ) => {
    Users.hasMany(models.Articles, {
        as: 'articles',
        foreignKey: 'authorId'
    })
};

const hashPassword = async (user) => {
    if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
};

Users.beforeCreate(hashPassword);
Users.beforeUpdate(hashPassword);

module.exports = Users;