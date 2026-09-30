import { DataTypes } from 'sequelize';
import sequelize from './index.js';

const TneaCutoff = sequelize.define('TneaCutoff', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  institution_id: { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  academic_year: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 2025 },
  round: { type: DataTypes.STRING(30), allowNull: false, defaultValue: 'Round 1' }, // Round 1, Round 2, Round 3, Supplementary
  community: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'OC' }, // OC, BC, BCM, MBC, SC, SCA, ST
  special_category: { type: DataTypes.STRING(100), defaultValue: 'General Academic' },
  quota: { type: DataTypes.STRING(50), defaultValue: 'TNEA Government Quota' },
  opening_rank: { type: DataTypes.INTEGER },
  closing_rank: { type: DataTypes.INTEGER },
  cutoff: { type: DataTypes.FLOAT, allowNull: false },
  source_id: { type: DataTypes.INTEGER, defaultValue: 1 },
  source_document: { type: DataTypes.STRING(255), defaultValue: 'Official DoTE TNEA Allotment Summary' },
  verified: { type: DataTypes.BOOLEAN, defaultValue: true },
  last_verified_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { 
  tableName: 'tnea_cutoffs', 
  timestamps: false 
});

export default TneaCutoff;
