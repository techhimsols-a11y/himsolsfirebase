# Deployment Documentation

## Overview

This document outlines the deployment process and infrastructure for the Eco Roots Bloom project. We use a modern CI/CD pipeline with containerization and cloud infrastructure.

## Infrastructure

### Cloud Provider
- AWS (Amazon Web Services)
- Regions: us-east-1, us-west-2
- Multi-AZ deployment

### Services Used
- ECS (Elastic Container Service)
- RDS (PostgreSQL)
- ElastiCache (Redis)
- S3 (Static Assets)
- CloudFront (CDN)
- Route 53 (DNS)
- ACM (SSL Certificates)

## Deployment Environments

### 1. Development
- Purpose: Local development and testing
- URL: dev.ecorootsbloom.com
- Auto-deploy from develop branch
- No production data

### 2. Staging
- Purpose: Pre-production testing
- URL: staging.ecorootsbloom.com
- Manual deployment from release branches
- Sanitized production data

### 3. Production
- Purpose: Live environment
- URL: ecorootsbloom.com
- Manual deployment from main branch
- Production data

## Deployment Process

### 1. Containerization

#### Dockerfile
```dockerfile
# Frontend
FROM node:18-alpine AS frontend
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# Backend
FROM node:18-alpine AS backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
RUN npm run build

# Production
FROM node:18-alpine
WORKDIR /app
COPY --from=frontend /app/dist ./frontend
COPY --from=backend /app/dist ./backend
COPY --from=backend /app/node_modules ./backend/node_modules
EXPOSE 4000
CMD ["node", "backend/dist/index.js"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:4000

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:pass@db:5432/eco_roots_bloom
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=eco_roots_bloom
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 2. CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tests
        run: |
          npm install
          npm run test
          npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build Docker Images
        run: |
          docker build -t ecorootsbloom/frontend:${{ github.sha }} ./frontend
          docker build -t ecorootsbloom/backend:${{ github.sha }} ./backend

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          aws ecs update-service --cluster production --service api --force-new-deployment
```

### 3. Database Migrations

#### Prisma Migrations
```bash
# Generate migration
npx prisma migrate dev --name migration_name

# Apply migration
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

### 4. Environment Configuration

#### Environment Variables
```env
# Frontend
NEXT_PUBLIC_API_URL=https://api.ecorootsbloom.com
NEXT_PUBLIC_APP_URL=https://ecorootsbloom.com

# Backend
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:pass@db:5432/eco_roots_bloom
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret-key
```

## Deployment Steps

### 1. Pre-deployment
1. Run tests
2. Update dependencies
3. Generate migrations
4. Update documentation
5. Create release notes

### 2. Deployment
1. Build Docker images
2. Push to registry
3. Update ECS services
4. Run migrations
5. Verify deployment

### 3. Post-deployment
1. Health checks
2. Smoke tests
3. Monitor logs
4. Update status page
5. Notify team

## Monitoring

### 1. Application Monitoring
- New Relic APM
- Error tracking
- Performance metrics
- User analytics

### 2. Infrastructure Monitoring
- CloudWatch
- Resource usage
- Cost monitoring
- Security monitoring

### 3. Logging
- CloudWatch Logs
- Error logs
- Access logs
- Audit logs

## Backup and Recovery

### 1. Database Backups
- Daily automated backups
- Point-in-time recovery
- Cross-region replication
- Backup verification

### 2. Application Backups
- Configuration backups
- Static asset backups
- Code backups
- Environment backups

### 3. Recovery Procedures
- Database restoration
- Application rollback
- Disaster recovery
- Business continuity

## Security

### 1. Infrastructure Security
- VPC configuration
- Security groups
- IAM roles
- Network ACLs

### 2. Application Security
- SSL/TLS
- WAF rules
- DDoS protection
- Security headers

### 3. Data Security
- Encryption at rest
- Encryption in transit
- Access control
- Data masking

## Scaling

### 1. Application Scaling
- Auto-scaling groups
- Load balancing
- Container orchestration
- Resource optimization

### 2. Database Scaling
- Read replicas
- Connection pooling
- Query optimization
- Index management

### 3. Cache Scaling
- Redis cluster
- Cache invalidation
- Cache warming
- Cache monitoring

## Maintenance

### 1. Regular Maintenance
- Security updates
- Dependency updates
- Performance optimization
- Resource cleanup

### 2. Emergency Maintenance
- Security patches
- Bug fixes
- Performance issues
- Infrastructure issues

### 3. Scheduled Maintenance
- Database maintenance
- Infrastructure updates
- Certificate renewal
- Backup verification 