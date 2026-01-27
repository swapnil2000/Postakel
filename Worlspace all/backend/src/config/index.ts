import dotenv from 'dotenv';

dotenv.config();

export const config = {
  node_env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  api_base_url: process.env.API_BASE_URL || 'http://localhost:5000',
  
  frontend_url: process.env.FRONTEND_URL || 'http://localhost:5173',
  frontend_production_url: process.env.FRONTEND_PRODUCTION_URL,
  
  // Master database for company signup and subscriptions (admin-backend database)
  master_database_url: process.env.MASTER_DATABASE_URL || process.env.DATABASE_URL,
  
  // Tenant database for employee and company data
  database_url: process.env.DATABASE_URL,
  
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration: process.env.JWT_EXPIRATION || '7d',
  
  smtp_host: process.env.SMTP_HOST,
  smtp_port: parseInt(process.env.SMTP_PORT || '587'),
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  smtp_from: process.env.SMTP_FROM,
  
  tenant_db_host: process.env.TENANT_DB_HOST || 'localhost',
  tenant_db_port: parseInt(process.env.TENANT_DB_PORT || '5432'),
  tenant_db_user: process.env.TENANT_DB_USER || 'postgres',
  tenant_db_password: process.env.TENANT_DB_PASSWORD,
  
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  
  log_level: process.env.LOG_LEVEL || 'info',
};

export default config;
