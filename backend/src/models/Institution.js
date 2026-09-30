import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Institution = sequelize.define('Institution', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tnea_code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  short_name: { type: DataTypes.STRING(50) },
  institution_type: { 
    type: DataTypes.STRING(100), 
    allowNull: false,
    defaultValue: 'Self Financing' // Government, Government Aided, Self Financing, University Department, Constituent College
  },
  ownership: { type: DataTypes.STRING(100), defaultValue: 'Private' },
  district_id: { type: DataTypes.INTEGER, allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
  address: { type: DataTypes.TEXT },
  pincode: { type: DataTypes.STRING(10) },
  university: { type: DataTypes.STRING(150), defaultValue: 'Anna University, Chennai' },
  affiliation: { type: DataTypes.STRING(150), defaultValue: 'Anna University' },
  autonomous: { type: DataTypes.BOOLEAN, defaultValue: false },
  established_year: { type: DataTypes.INTEGER },
  accreditation: { type: DataTypes.STRING(150), defaultValue: 'NAAC / NBA' },
  website: { type: DataTypes.STRING(255) },
  phone: { type: DataTypes.STRING(100) },
  email: { type: DataTypes.STRING(150) },
  latitude: { type: DataTypes.FLOAT },
  longitude: { type: DataTypes.FLOAT },
  description: { type: DataTypes.TEXT },
  logo_url: { type: DataTypes.STRING(255) },
  ranking: { type: DataTypes.INTEGER },
  placement_rate: { type: DataTypes.FLOAT },
  avg_package: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING(30), defaultValue: 'Active' },
  last_verified_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  tableName: 'institutions', 
  timestamps: false 
});

export default Institution;
