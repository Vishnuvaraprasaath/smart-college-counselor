import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Student = sequelize.define('Student', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(255) },
  email: { type: DataTypes.STRING(255) },
  cutoff: { type: DataTypes.FLOAT },
  math: { type: DataTypes.FLOAT },
  physics: { type: DataTypes.FLOAT },
  chemistry: { type: DataTypes.FLOAT },
  percentage: { type: DataTypes.FLOAT },
  entrance_score: { type: DataTypes.FLOAT },
  category: { type: DataTypes.STRING(10) },
  preferred_courses: { type: DataTypes.TEXT },
  preferred_location: { type: DataTypes.STRING(100) },
  location: { type: DataTypes.STRING(100) },
  budget: { type: DataTypes.INTEGER },
  interests: { type: DataTypes.TEXT }
}, { tableName: 'students', timestamps: true, createdAt: 'created_at', updatedAt: false });

export default Student;
