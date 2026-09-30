import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(255), allowNull: false },
  course_code: { type: DataTypes.STRING(20) }, // alias for strict normalized queries
  course_name: { type: DataTypes.STRING(255) },
  degree: { type: DataTypes.STRING(20), defaultValue: 'B.E.' },
  discipline: { type: DataTypes.STRING(100), defaultValue: 'Engineering' },
  specialization: { type: DataTypes.STRING(150) },
  duration: { type: DataTypes.STRING(20), defaultValue: '4 Years' },
  description: { type: DataTypes.TEXT },
  overview: { type: DataTypes.TEXT },
  skills: { type: DataTypes.TEXT },
  careers: { type: DataTypes.TEXT },
  industries: { type: DataTypes.TEXT }
}, { 
  tableName: 'courses', 
  timestamps: false 
});

export default Course;
