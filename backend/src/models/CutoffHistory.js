import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const CutoffHistory = sequelize.define('CutoffHistory', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  college_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  category: { type: DataTypes.STRING(10), allowNull: false },
  year: { type: DataTypes.INTEGER, allowNull: false },
  cutoff: { type: DataTypes.FLOAT, allowNull: false }
}, { tableName: 'cutoff_history', timestamps: false });

export default CutoffHistory;
