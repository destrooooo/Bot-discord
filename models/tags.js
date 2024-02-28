const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "tags",
    {
      name: {
        type: Sequelize.STRING,
        unique: true
      },
      description: Sequelize.TEXT,
      username: Sequelize.STRING,
      usage_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false
      }
    },
    {
      timestamps: false
    }
  );
};
