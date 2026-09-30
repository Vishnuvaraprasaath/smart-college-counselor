import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Determine database dialect and SSL requirements
const resolveDialect = (url) => {
  if (process.env.DB_DIALECT) return process.env.DB_DIALECT;
  if (url) {
    if (url.startsWith('mysql://')) return 'mysql';
    if (url.startsWith('postgres://') || url.startsWith('postgresql://')) return 'postgres';
  }
  return parseInt(process.env.DB_PORT, 10) === 3306 ? 'mysql' : 'postgres';
};

const dialect = resolveDialect(process.env.DATABASE_URL);
const requiresSSL = process.env.DB_SSL === 'true' || (dialect === 'postgres' && process.env.NODE_ENV === 'production');

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect,
      logging: false,
      define: { timestamps: false },
      pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
      dialectOptions: requiresSSL
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : {}
    })
  : new Sequelize(
      process.env.DB_NAME || 'smart_counsel',
      process.env.DB_USER || 'root',
      process.env.DB_PASS || '',
      {
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        dialect: resolveDialect(),
        logging: false,
        define: { timestamps: false },
        pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
        dialectOptions: process.env.DB_SSL === 'true'
          ? { ssl: { require: true, rejectUnauthorized: false } }
          : {}
      }
    );

export default sequelize;
