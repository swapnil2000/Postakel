# Postakel Backend Deployment Guide

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Docker Setup](#docker-setup)
3. [AWS EC2 Deployment](#aws-ec2-deployment)
4. [Production Configuration](#production-configuration)
5. [Database Migration](#database-migration)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Local Development Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- PostgreSQL 12+
- Git

### Steps

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd backend
   npm install
   ```

2. **Create Environment File**
   ```bash
   cp .env.example .env
   ```

3. **Configure Database**
   ```bash
   # Create master database
   createdb postakel_master
   
   # Set DATABASE_URL in .env
   DATABASE_URL="postgresql://user:password@localhost:5432/postakel_master"
   ```

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Server runs at `http://localhost:5000`

## Docker Setup

### Docker Compose (Recommended for Development)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

Services started:
- PostgreSQL on port 5432
- Backend API on port 5000

### Docker Image Build

```bash
# Build image
docker build -t postakel-backend:latest .

# Run container
docker run -d \
  -p 5000:5000 \
  -e DATABASE_URL="postgresql://postgres:password@host:5432/postakel_master" \
  -e JWT_SECRET="your-secret-key" \
  --name postakel \
  postakel-backend:latest
```

## AWS EC2 Deployment

### 1. Launch EC2 Instance

**Instance Configuration:**
- AMI: Ubuntu 22.04 LTS
- Instance Type: t3.medium (or t2.medium)
- Root Volume: 20 GB gp3
- Security Groups: Allow 80, 443, 5432 (PostgreSQL for internal)

### 2. Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install other dependencies
sudo apt install -y git nginx certbot python3-certbot-nginx
```

### 3. Clone and Configure Application

```bash
# Create app directory
sudo mkdir -p /var/www/postakel-backend
sudo chown -R $USER:$USER /var/www/postakel-backend

# Clone repository
cd /var/www/postakel-backend
git clone <repository-url> .

# Install dependencies
npm install

# Create .env file
cp .env.example .env
nano .env  # Edit with production values
```

### 4. Setup PostgreSQL

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE postakel_master;
CREATE USER postakel_user WITH PASSWORD 'strong_password';
ALTER ROLE postakel_user SET client_encoding TO 'utf8';
ALTER ROLE postakel_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE postakel_user SET default_transaction_deferrable TO on;
ALTER ROLE postakel_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE postakel_master TO postakel_user;
\q
```

### 5. Build and Setup

```bash
cd /var/www/postakel-backend

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Build application
npm run build
```

### 6. Setup PM2 Process Manager

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start dist/index.js --name "postakel-api"

# Setup startup on reboot
pm2 startup
pm2 save

# View logs
pm2 logs postakel-api

# Monitor
pm2 monit
```

### 7. Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/postakel-api

# Add configuration:
```

```nginx
upstream postakel_backend {
    server localhost:5000;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    
    client_max_body_size 10M;
    
    location / {
        proxy_pass http://postakel_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts for long operations
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/postakel-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 8. Setup SSL Certificate

```bash
# Install and configure SSL with Certbot
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal should be enabled
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 9. Setup Firewall

```bash
# Enable UFW
sudo ufw enable

# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Production Configuration

### Environment Variables (.env)

```env
# Application
NODE_ENV=production
PORT=5000
API_BASE_URL=https://api.yourdomain.com

# Frontend
FRONTEND_URL=https://yourdomain.com
FRONTEND_PRODUCTION_URL=https://yourdomain.vercel.app

# Database - Master
DATABASE_URL=postgresql://postakel_user:strong_password@localhost:5432/postakel_master

# JWT
JWT_SECRET=generate-a-strong-random-secret-key-here
JWT_EXPIRATION=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
SMTP_FROM=noreply@postakel.com

# Tenant Database
TENANT_DB_HOST=localhost
TENANT_DB_PORT=5432
TENANT_DB_USER=postakel_user
TENANT_DB_PASSWORD=strong_password

# Logging
LOG_LEVEL=info

# Optional - Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

### Security Best Practices

1. **JWT Secret**: Generate a strong random key
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Database Password**: Use strong passwords
   ```bash
   openssl rand -base64 32
   ```

3. **CORS Configuration**: Only allow trusted origins

4. **Rate Limiting**: Implement in production

5. **HTTPS**: Always use SSL/TLS

6. **Environment Separation**: Keep dev and prod .env separate

## Database Migration

### Creating New Databases for Tenants

The system automatically creates tenant databases on signup. To manually create:

```bash
# Connect to master
psql postgresql://postakel_user:password@localhost:5432/postakel_master

-- Create tenant database
CREATE DATABASE postakel_tenant_acme_corp;

-- Create user
CREATE USER tenant_acme WITH PASSWORD 'tenant_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE postakel_tenant_acme_corp TO tenant_acme;

-- Connect to tenant database
\c postakel_tenant_acme_corp

-- Run Prisma migrations
\q
```

Then in Node.js context:
```bash
DATABASE_URL="postgresql://tenant_acme:tenant_password@localhost:5432/postakel_tenant_acme_corp" \
npm run prisma:migrate
```

### Backup and Restore

**Backup**
```bash
# Backup master database
pg_dump -U postakel_user postakel_master > master_backup.sql

# Backup specific tenant
pg_dump -U tenant_acme postakel_tenant_acme_corp > tenant_backup.sql

# Backup all databases
pg_dumpall -U postgres > all_databases.sql
```

**Restore**
```bash
# Restore master database
psql -U postakel_user postakel_master < master_backup.sql

# Restore tenant database
psql -U tenant_acme postakel_tenant_acme_corp < tenant_backup.sql
```

## Monitoring and Maintenance

### Health Check

```bash
# Check API health
curl https://api.yourdomain.com/health

# Response:
# {"status":"ok","service":"Postakel Backend","timestamp":"2024-01-01T12:00:00Z"}
```

### Logs

```bash
# View PM2 logs
pm2 logs postakel-api

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# View SystemD journal (if using systemd)
sudo journalctl -u postakel-api -f
```

### Database Maintenance

```bash
# Check database size
sudo -u postgres psql -c "SELECT datname, pg_size_pretty(pg_database_size(datname)) FROM pg_database ORDER BY pg_database_size(datname) DESC;"

# Vacuum and analyze
sudo -u postgres vacuumdb -U postakel_user postakel_master
sudo -u postgres analyzedb -U postakel_user postakel_master

# Clear logs
truncate --size 0 /var/log/nginx/access.log
truncate --size 0 /var/log/nginx/error.log
```

### Monitoring Tools

1. **PM2 Monitoring**
   ```bash
   pm2 web  # Access at http://localhost:9615
   ```

2. **New Relic Integration**
   ```bash
   npm install newrelic
   node -r newrelic dist/index.js
   ```

3. **DataDog Integration**
   - Install DataDog agent
   - Configure in application

### Updates and Patches

```bash
# Update dependencies
npm update

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update Node.js
sudo apt update
sudo apt install -y nodejs

# Restart application
pm2 restart postakel-api
```

### Backup Schedule

Set up automated backups using cron:

```bash
# Add to crontab
crontab -e

# Add backup job (daily at 2 AM)
0 2 * * * /var/www/postakel-backend/backup.sh
```

Create backup script:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/postakel"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup master database
pg_dump -U postakel_user postakel_master | gzip > $BACKUP_DIR/master_$TIMESTAMP.sql.gz

# Keep only last 7 days of backups
find $BACKUP_DIR -name "master_*.sql.gz" -mtime +7 -delete
```

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs postakel-api

# Check port availability
sudo lsof -i :5000

# Check Node.js version
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
psql -h localhost -U postakel_user -d postakel_master

# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

## Support

For deployment issues, contact: support@postakel.com
