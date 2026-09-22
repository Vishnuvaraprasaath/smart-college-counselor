import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const College = sequelize.define('College', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  city: { type: DataTypes.STRING(100), allowNull: false },
  district: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: false, defaultValue: 'Tamil Nadu' },
  type: { type: DataTypes.STRING(100) },
  website: { type: DataTypes.STRING(255) },
  fees: { type: DataTypes.INTEGER, defaultValue: 0 },
  hostel_available: { type: DataTypes.TINYINT(1), defaultValue: 0 },
  hostel_fee: { type: DataTypes.INTEGER, defaultValue: 0 },
  facilities: { type: DataTypes.TEXT },
  accreditation: { type: DataTypes.STRING(255) },
  ranking: { type: DataTypes.INTEGER },
  placement_rate: { type: DataTypes.FLOAT },
  avg_package: { type: DataTypes.FLOAT }
}, { tableName: 'colleges', timestamps: false });

export default College;
