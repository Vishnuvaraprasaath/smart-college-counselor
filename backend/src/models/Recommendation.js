import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const Recommendation = sequelize.define('Recommendation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  student_id: { type: DataTypes.INTEGER },
  college_id: { type: DataTypes.INTEGER },
  course_id: { type: DataTypes.INTEGER },
  suitability_score: { type: DataTypes.FLOAT },
  chance_category: { type: DataTypes.STRING(20) },
  cutoff_delta: { type: DataTypes.FLOAT },
  explanation: { type: DataTypes.TEXT },
  reasons: { type: DataTypes.TEXT }
}, { tableName: 'recommendations', timestamps: true, createdAt: 'created_at', updatedAt: false });

export default Recommendation;
