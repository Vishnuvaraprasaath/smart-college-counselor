import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const DataSource = sequelize.define('DataSource', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  source_name: { type: DataTypes.STRING(255), allowNull: false },
  source_type: { type: DataTypes.STRING(100), defaultValue: 'Official TNEA Portal' },
  url: { type: DataTypes.STRING(255), defaultValue: 'https://www.tneaonline.org' },
  academic_year: { type: DataTypes.INTEGER, defaultValue: 2025 },
  retrieved_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  verified_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING(50), defaultValue: 'Verified' },
  notes: { type: DataTypes.TEXT }
}, { 
  tableName: 'data_sources', 
  timestamps: false 
});

export default DataSource;
