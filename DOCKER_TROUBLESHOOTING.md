# Docker Troubleshooting Guide

## Common Issues and Solutions

### 1. Container Restarting (CrashLoop)

**Symptoms:**
```
STATUS: Restarting (0) X seconds ago
PORTS: (empty)
```

**Solutions:**

#### Check Logs
```bash
docker logs aircraft-monitoring-api
# or
docker-compose logs api
```

#### Common Causes:

1. **Database Connection Issue**
   - API starts before PostgreSQL is ready
   - Solution: `depends_on` with `condition: service_healthy` is already configured

2. **Missing Environment Variables**
   - Check if `DATABASE_URL` is set correctly
   - Solution: Verify `.docker.env` or environment variables

3. **Application Code Error**
   - Check logs for specific error messages
   - Solution: Fix the error in code and rebuild

#### Rebuild and Restart
```bash
# Stop containers
docker-compose down

# Rebuild without cache
docker-compose build --no-cache

# Start with logs
docker-compose up
```

### 2. Ports Not Showing

**Symptoms:**
```
PORTS: (empty)
```

**Solutions:**

1. **Check docker-compose.yml**
   - Verify `ports` section exists:
   ```yaml
   ports:
     - "${API_PORT:-3000}:3000"
   ```

2. **Check if port is already in use**
   ```bash
   # Linux/Mac
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```

3. **Restart Docker service**
   ```bash
   # Linux
   sudo systemctl restart docker
   ```

### 3. Database Connection Errors

**Symptoms:**
```
Error: P1001: Can't reach database server
```

**Solutions:**

1. **Wait for database to be ready**
   ```bash
   # Check database health
   docker-compose ps postgres
   
   # Check database logs
   docker-compose logs postgres
   ```

2. **Verify DATABASE_URL**
   ```bash
   docker-compose exec api env | grep DATABASE_URL
   ```

3. **Test connection manually**
   ```bash
   docker-compose exec postgres psql -U postgres -d aircraft_monitoring -c "SELECT 1;"
   ```

### 4. Prisma Client Errors

**Symptoms:**
```
Error: Can't find module '@prisma/client'
```

**Solutions:**

1. **Regenerate Prisma Client**
   ```bash
   docker-compose exec api npx prisma generate
   ```

2. **Rebuild container**
   ```bash
   docker-compose build --no-cache api
   docker-compose up -d api
   ```

### 5. Permission Errors

**Symptoms:**
```
Error: EACCES: permission denied
```

**Solutions:**

1. **Check file permissions**
   ```bash
   ls -la dist/
   ```

2. **Rebuild with correct permissions**
   - Dockerfile already sets correct ownership
   - Rebuild: `docker-compose build --no-cache api`

## Diagnostic Commands

### Check Container Status
```bash
docker-compose ps
```

### View All Logs
```bash
docker-compose logs -f
```

### View Specific Service Logs
```bash
docker-compose logs -f api
docker-compose logs -f postgres
```

### Execute Commands in Container
```bash
# Access API container shell
docker-compose exec api sh

# Access database
docker-compose exec postgres psql -U postgres -d aircraft_monitoring

# Run Prisma commands
docker-compose exec api npx prisma studio
docker-compose exec api npx prisma migrate deploy
```

### Check Network Connectivity
```bash
# From API container to database
docker-compose exec api ping postgres

# Test database connection from API
docker-compose exec api node -e "require('pg').connect(process.env.DATABASE_URL, (err) => console.log(err ? 'Error' : 'Connected'))"
```

### Inspect Container
```bash
docker inspect aircraft-monitoring-api
docker inspect aircraft-monitoring-db
```

## Complete Reset

If nothing works, perform a complete reset:

```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove images
docker rmi aircraft-monitoring-api-api

# Clean build
docker-compose build --no-cache

# Start fresh
docker-compose up -d

# Check logs
docker-compose logs -f
```

## Health Checks

### Check API Health
```bash
curl http://localhost:3000/api
```

### Check Database Health
```bash
docker-compose exec postgres pg_isready -U postgres
```

### Check Container Health Status
```bash
docker inspect --format='{{.State.Health.Status}}' aircraft-monitoring-api
docker inspect --format='{{.State.Health.Status}}' aircraft-monitoring-db
```

