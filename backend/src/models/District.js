import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const District = sequelize.define('District', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  state_id: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  headquarters: { type: DataTypes.STRING(100) },
  region: { type: DataTypes.STRING(50) } // Western, Northern, Southern, Central
}, { 
  tableName: 'districts', 
  timestamps: false 
});

export default District;
