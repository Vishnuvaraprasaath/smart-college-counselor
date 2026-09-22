import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const CollegeCourse = sequelize.define('CollegeCourse', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  college_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  seats: { type: DataTypes.INTEGER, defaultValue: 60 },
  fees: { type: DataTypes.INTEGER, defaultValue: 0 },
  eligibility: { type: DataTypes.TEXT }
}, { tableName: 'college_courses', timestamps: false });

export default CollegeCourse;
