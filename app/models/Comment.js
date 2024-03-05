const { DataTypes } = require("sequelize");
const { sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isApproved: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    Comment.associate = (models) => {
        Comment.belongsTo(models.BlogPost, {
            foreignKey: {
                allowNull: false,
            },
            onDelete: 'CASCADE',
        });
    };

    return Comment;
};


