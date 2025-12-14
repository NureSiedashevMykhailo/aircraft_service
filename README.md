# Aircraft Monitoring System API

RESTful API for aircraft technical condition monitoring system.

## Tech Stack

- **Framework:** Nest.js
- **Language:** TypeScript
- **Database:** PostgreSQL 14+
- **ORM:** Prisma
- **Environment:** Node.js 18+

## Installation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Database Setup

1. **Create PostgreSQL database:**
   ```sql
   CREATE DATABASE aircraft_monitoring;
   ```

2. **Create `.env` file from example:**
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   
   # Linux/Mac
   cp .env.example .env
   ```

3. **Edit `.env` file and specify your connection details:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/aircraft_monitoring?schema=public"
   ```
   
   Replace:
   - `username` - your PostgreSQL user
   - `password` - your PostgreSQL password
   - `localhost:5432` - host and port (if different)
   - `aircraft_monitoring` - database name

### Step 3: Apply Database Schema

```bash
# Apply schema to database
npm run db:push
```

Or use migrations:
```bash
npm run db:migrate
```

### Step 4: Generate Prisma Client

```bash
npm run db:generate
```

### Step 5: Seed Database (Optional)

Populate the database with mock data for testing:

```bash
npm run db:seed
```

This will create:
- 3 users (admin, engineer1, engineer2)
- 3 aircrafts (RA-12345, RA-67890, RA-11111)
- 4 components
- 40 telemetry records
- 3 alerts
- 3 maintenance schedules
- 4 maintenance tasks

### Step 6: Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm run build
npm run start
```

API will be available at: **http://localhost:3000/api**

**Swagger documentation:** http://localhost:3000/api/docs

## Project Structure

```
.
├── src/
│   ├── main.ts           # Application entry point
│   ├── app.module.ts     # Root module
│   ├── prisma/
│   │   └── prisma.service.ts  # Prisma Service
│   ├── telemetry/
│   │   ├── telemetry.controller.ts
│   │   ├── telemetry.service.ts
│   │   └── dto/
│   ├── aircraft/
│   │   ├── aircraft.controller.ts
│   │   └── aircraft.service.ts
│   ├── maintenance/
│   │   ├── maintenance.controller.ts
│   │   ├── maintenance.service.ts
│   │   └── dto/
│   └── alerts/
│       ├── alerts.controller.ts
│       └── alerts.service.ts
├── prisma/
│   └── schema.prisma     # Prisma schema
└── openapi.yaml          # OpenAPI specification
```

## API Endpoints

### POST /api/telemetry
Accept telemetry data (single record or array).

**Request example:**
```json
{
  "time": "2024-01-15T10:30:00Z",
  "aircraft_id": 1,
  "parameter_name": "engine_temperature",
  "value": 85.5
}
```

### GET /api/aircrafts/:id
Get aircraft information by ID.

### POST /api/maintenance
Create maintenance schedule or task.

**Schedule creation example:**
```json
{
  "schedule": {
    "aircraft_id": 1,
    "scheduled_date": "2024-02-15",
    "description": "Planned maintenance",
    "status": "pending"
  }
}
```

**Task creation example:**
```json
{
  "task": {
    "schedule_id": 1,
    "assigned_user_id": 2,
    "description": "Check cooling system"
  }
}
```

### GET /api/alerts/:aircraftId
Get alerts for a specific aircraft.

**Query parameters:**
- `include_acknowledged` (boolean) - include acknowledged alerts
- `severity` (string) - filter by severity level: `info`, `warning`, `critical`

## API Documentation

### Swagger UI (Interactive Documentation)

After starting the server, Swagger UI is available at:
**http://localhost:3000/api/docs**

Swagger UI provides:
- Interactive documentation of all API endpoints
- Ability to test API directly from the browser
- Description of all DTOs and data schemas
- Request and response examples

### OpenAPI Specification

Full API specification is also available in `openapi.yaml` file (OpenAPI 3.0.3).

For viewing you can use:
- [Swagger Editor](https://editor.swagger.io/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

## Scripts

- `npm run dev` - start development server
- `npm run build` - build project
- `npm run start` - start production server
- `npm run db:generate` - generate Prisma Client
- `npm run db:push` - apply schema changes to database
- `npm run db:migrate` - create migration
- `npm run db:studio` - open Prisma Studio
- `npm run db:seed` - populate database with mock data

## Database

Database schema includes the following tables:
- `users` - system users
- `aircrafts` - aircraft
- `components` - aircraft components
- `telemetry` - telemetry data
- `alerts` - alerts
- `maintenance_schedules` - maintenance schedules
- `maintenance_tasks` - maintenance tasks

## Notes

- The `telemetry` table uses a composite primary key (time, aircraft_id, parameter_name)
- All API endpoints return JSON with `success` field and corresponding data or errors
- Input validation is performed using class-validator (DTOs)
- The project uses Nest.js architecture with separation into modules, controllers and services

## Testing with Mock Data

After running `npm run db:seed`, you can test the API with the following:

- **Get aircraft info:** `GET /api/aircrafts/1` (or 2, 3)
- **Create telemetry:** `POST /api/telemetry` (use `aircraft_id: 1, 2, or 3`)
- **Get alerts:** `GET /api/alerts/1` (or 2, 3)
- **Create maintenance:** `POST /api/maintenance` (use existing `aircraft_id`)

All mock data uses aircraft IDs: 1, 2, or 3.

