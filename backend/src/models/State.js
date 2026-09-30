import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const State = sequelize.define('State', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'Tamil Nadu' },
  code: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'TN' }
}, { 
  tableName: 'states', 
  timestamps: false 
});

export default State;
