import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const InstitutionCourse = sequelize.define('InstitutionCourse', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  institution_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  course_code: { type: DataTypes.STRING(20) },
  intake: { type: DataTypes.INTEGER, defaultValue: 60 },
  eligibility: { type: DataTypes.STRING(255), defaultValue: 'Pass in 12th Std with Physics, Chemistry & Mathematics (PCM)' },
  admission_type: { type: DataTypes.STRING(100), defaultValue: 'TNEA Single Window System' },
  annual_fee: { type: DataTypes.INTEGER, defaultValue: 55000 },
  hostel_available: { type: DataTypes.BOOLEAN, defaultValue: true },
  hostel_fee: { type: DataTypes.INTEGER, defaultValue: 65000 },
  status: { type: DataTypes.STRING(30), defaultValue: 'Active' }
}, { 
  tableName: 'institution_courses', 
  timestamps: false 
});

export default InstitutionCourse;
