'use strict';

const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('password', crypto
          .createHash('RSA-SHA256')
          .update(value)
          .digest('hex')
        );
      }
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  User.prototype.validPassword = function(value) {
    return crypto
      .createHash('RSA-SHA256')
      .update(value)
      .digest('hex').localeCompare(this.password) === 0;
  }
  return User;
};