import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  description: { type: DataTypes.TEXT },
  overview: { type: DataTypes.TEXT },
  skills: { type: DataTypes.TEXT },
  careers: { type: DataTypes.TEXT },
  industries: { type: DataTypes.TEXT }
}, { tableName: 'courses', timestamps: false });

export default Course;
