import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const StudentPreference = sequelize.define('StudentPreference', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  cutoff: { type: DataTypes.FLOAT },
  category: { type: DataTypes.STRING(10) },
  courses: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING(100) },
  budget: { type: DataTypes.INTEGER },
  interests: { type: DataTypes.TEXT }
}, { tableName: 'student_preferences', timestamps: true, createdAt: 'created_at', updatedAt: false });

export default StudentPreference;
