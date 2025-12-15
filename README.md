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
- 4 aircrafts (RA-12345, RA-67890, RA-11111, AIRCRAFT-001)
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
│   ├── alerts/
│   │   ├── alerts.controller.ts
│   │   └── alerts.service.ts
│   └── users/
│       ├── users.controller.ts
│       ├── users.service.ts
│       └── dto/
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

### Maintenance Endpoints

#### POST /api/maintenance
Create maintenance schedule or task.

**Schedule creation example:**
```json
{
  "schedule": {
    "aircraft_id": 1,
    "scheduled_date": "2024-02-15",
    "description": "Planned maintenance",
    "status": "pending",
    "is_predicted": false
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

#### GET /api/maintenance/schedules
Get all maintenance schedules with optional filters.

**Query parameters:**
- `aircraft_id` (number) - filter by aircraft ID
- `status` (string) - filter by status: `pending`, `in_progress`, `completed`, `cancelled`
- `is_predicted` (boolean) - filter by predicted flag
- `from_date` (string) - filter schedules from date (YYYY-MM-DD)
- `to_date` (string) - filter schedules to date (YYYY-MM-DD)

**Example:**
```
GET /api/maintenance/schedules?is_predicted=true&status=pending
```

#### GET /api/maintenance/schedules/:id
Get maintenance schedule by ID with all related tasks.

#### PATCH /api/maintenance/schedules/:id
Update maintenance schedule.

**Request body example:**
```json
{
  "scheduled_date": "2024-03-01",
  "description": "Updated maintenance description",
  "status": "in_progress",
  "is_predicted": false
}
```

#### DELETE /api/maintenance/schedules/:id
Delete maintenance schedule and all associated tasks.

#### POST /api/maintenance/generate-forecast/:aircraftId
Generate maintenance forecast based on telemetry data analysis.

This endpoint:
- Analyzes recent telemetry (last 24 hours) for engine_temp, vibration, oil_pressure
- Checks component wear levels
- Considers total flight hours
- Creates or updates a predicted maintenance schedule (`is_predicted: true`)

**Response example:**
```json
{
  "success": true,
  "message": "Maintenance forecast generated successfully",
  "data": {
    "schedule_id": 5,
    "aircraft_id": 1,
    "scheduled_date": "2024-03-15",
    "is_predicted": true,
    ...
  },
  "analysis": {
    "days_until_maintenance": 45,
    "forecast_date": "2024-03-15T00:00:00.000Z",
    "factors": {
      "avg_engine_temp": 92.5,
      "avg_vibration": 1.8,
      "avg_oil_pressure": 42.0,
      "critical_components_count": 1,
      "total_flight_hours": 1250.5
    }
  }
}
```

### GET /api/alerts/:aircraftId
Get alerts for a specific aircraft.

**Query parameters:**
- `include_acknowledged` (boolean) - include acknowledged alerts
- `severity` (string) - filter by severity level: `info`, `warning`, `critical`

### Administration Endpoints

#### GET /api/admin/users
Get list of all users (without password hashes).

**Response example:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "email": "admin@aircraft-monitoring.local",
      "full_name": "Admin User",
      "role": "admin",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### DELETE /api/admin/users/:id
Delete a user by ID.

#### PATCH /api/admin/users/:id/role
Update user role.

**Request body example:**
```json
{
  "role": "engineer"
}
```

**Available roles:** `admin`, `engineer`, `technician`, `operator`

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

## Deployment to Vercel

This project is configured to run as a serverless function on Vercel.

### Prerequisites

1. Install Vercel CLI (optional):
   ```bash
   npm i -g vercel
   ```

2. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

### Deployment Steps

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   # Using Vercel CLI
   vercel
   
   # Or connect your GitHub repository to Vercel dashboard
   ```

3. **Configure Environment Variables:**
   In Vercel dashboard, add the following environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NODE_ENV` - Set to `production`

4. **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Important Notes

- The application automatically detects Vercel environment using `VERCEL` environment variable
- In Vercel, the app runs as a serverless function using `@vendia/serverless-express`
- For local development, the app runs normally on port 3000
- Make sure your database is accessible from Vercel (consider using connection pooling for serverless)

### Vercel Configuration

The project includes `vercel.json` with the following configuration:
- Routes all requests to `dist/main.js`
- Uses `@vercel/node` builder
- Sets `NODE_ENV` to `production`

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

## Features

### Automatic Anomaly Detection
When telemetry data is saved, the system automatically checks for anomalies based on thresholds:
- **engine_temp**: maximum 120.0°C
- **vibration**: maximum 5.0
- **oil_pressure**: minimum 30.0

If a value exceeds its threshold, a critical alert is automatically created in the `alerts` table.

### Maintenance Forecast Generation
The system can automatically generate maintenance forecasts based on:
- Recent telemetry data analysis (last 24 hours)
- Component wear levels
- Total flight hours
- Historical maintenance patterns

Forecasts are marked with `is_predicted: true` and can be updated as new data becomes available.

### IoT Client Support
The telemetry endpoint supports both standard format and IoT client format:

**IoT Client Format:**
```json
{
  "aircraft_id": "AIRCRAFT-001",
  "timestamp": "2024-01-15T10:30:00Z",
  "engine_temp": 90.5,
  "vibration": 1.2,
  "oil_pressure": 45.0
}
```

The system automatically:
- Converts aircraft registration number to aircraft ID
- Splits IoT data into individual telemetry records
- Validates and stores all parameters

## Notes

- The `telemetry` table uses a composite primary key (time, aircraft_id, parameter_name)
- All API endpoints return JSON with `success` field and corresponding data or errors
- Input validation is performed using class-validator (DTOs)
- The project uses Nest.js architecture with separation into modules, controllers and services
- Maintenance schedules can be marked as `is_predicted: true` for forecasted maintenance

## Testing with Mock Data

After running `npm run db:seed`, you can test the API with the following:

- **Get aircraft info:** `GET /api/aircrafts/1` (or 2, 3, 4)
- **Create telemetry:** `POST /api/telemetry` (use `aircraft_id: 1, 2, 3, or 4`)
- **Get alerts:** `GET /api/alerts/1` (or 2, 3, 4)
- **Create maintenance:** `POST /api/maintenance` (use existing `aircraft_id`)
- **Get all schedules:** `GET /api/maintenance/schedules`
- **Generate forecast:** `POST /api/maintenance/generate-forecast/1`
- **Get users:** `GET /api/admin/users`
- **Update user role:** `PATCH /api/admin/users/1/role` with `{"role": "engineer"}`

**IoT Client Testing:**
The seed script creates an aircraft with `reg_number: "AIRCRAFT-001"` for IoT client testing. You can send telemetry in IoT format:
```json
{
  "aircraft_id": "AIRCRAFT-001",
  "timestamp": "2024-01-15T10:30:00Z",
  "engine_temp": 90.5,
  "vibration": 1.2
}
```

All mock data uses aircraft IDs: 1, 2, 3, or 4.

