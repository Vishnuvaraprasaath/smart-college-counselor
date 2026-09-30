import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const DataImport = sequelize.define('DataImport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  source_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  file_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  academic_year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  records_processed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  records_added: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  records_updated: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  records_rejected: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  imported_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'completed'
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'data_imports',
  timestamps: false
});

export default DataImport;
