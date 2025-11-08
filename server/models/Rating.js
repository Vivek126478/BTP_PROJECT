const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rating = sequelize.define('Rating', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  raterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'rater_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rateeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ratee_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  rideId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'ride_id',
    references: {
      model: 'rides',
      key: 'id'
    }
  },
  stars: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT
  },
  blockchainTxHash: {
    type: DataTypes.STRING(66),
    field: 'blockchain_tx_hash'
  }
}, {
  tableName: 'ratings',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['rater_id', 'ratee_id', 'ride_id']
    }
  ]
});

module.exports = Rating;
