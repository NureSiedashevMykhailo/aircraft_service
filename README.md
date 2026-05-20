# ✈️ Aircraft Monitoring System API

[![NestJS](https://img.shields.io/badge/Framework-Nest.js-red.svg?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue.svg?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748.svg?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED.svg?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000.svg?style=for-the-badge&logo=vercel)](https://vercel.com/)

**Aircraft Monitoring System API** is a high-performance RESTful service built with NestJS and Prisma ORM, designed for real-time telemetry processing, automated anomaly detection, and predictive maintenance scheduling for commercial aircraft fleets.

---

## 🛠️ System Architecture & Data Flow

The system processes high-frequency time-series telemetry from aircraft sensors, stores records in PostgreSQL, validates them against safe operating thresholds to trigger alerts, and runs a predictive analytics algorithm to forecast maintenance schedules.

```mermaid
flowchart TD
    subgraph Ingestion
        IoT[📡 IoT Sensor Client] -->|IoT Payload: Reg Number| TelemetryAPI[POST /api/telemetry]
        Std[💻 Fleet Operator] -->|Standard JSON: Aircraft ID| TelemetryAPI
    end

    subgraph Core Processing
        TelemetryAPI -->|Batch Ingestion| Service[Telemetry Service]
        Service -->|Write Time-Series| DB[(PostgreSQL)]
        Service -->|Check Thresholds| Anomaly[Anomaly Detection Engine]
    end

    subgraph Alerts & Notifications
        Anomaly -->|Threshold Exceeded| AlertDB[Create Critical Alert]
        AlertDB --> DB
    end

    subgraph Predictive Analysis
        ForecastAPI[POST /api/maintenance/generate-forecast/:aircraftId] -->|Trigger| ForecastService[Forecast Engine]
        DB -->|Fetch Last 24h Telemetry| ForecastService
        DB -->|Fetch Wear Levels & Flight Hours| ForecastService
        ForecastService -->|Multi-Factor Forecast Algorithm| Predict[Predict Next Maintenance Date]
        Predict -->|Create/Update is_predicted: true| SchedDB[Maintenance Schedule]
        SchedDB --> DB
    end
```

---

## ⚡ Key Features

### 1. High-Frequency Telemetry Ingestion
- Supports standard time-series data formats.
- Supports bulk uploads (batch processing up to **1000 records** in a single request).
- **IoT Payload Normalization:** Converts aircraft registration codes (e.g., `AIRCRAFT-001`) into internal database IDs automatically and normalizes flat sensor feeds.

### 2. Real-Time Anomaly Detection
Every telemetry record ingested is automatically checked against critical physical thresholds:
- **Engine Temperature (`engine_temp`):** Critical above **`120.0°C`**
- **Vibration level (`vibration`):** Critical above **`5.0`**
- **Oil Pressure (`oil_pressure`):** Critical below **`30.0 PSI`**

If a record violates these parameters, the system instantly logs a `critical` severity alert inside the `alerts` database table for engineers.

### 3. Multi-Factor Predictive Maintenance
The `POST /api/maintenance/generate-forecast/:aircraftId` endpoint implements a predictive maintenance forecast engine analyzing several flight factors to schedule necessary servicing before failures occur:
- **Base Interval:** Starts at 90 days.
- **Engine Temp Impact:** If average temp > 110°C reduces interval by **30 days**; > 100°C reduces it by **15 days**.
- **Vibration Impact:** If average vibration > 4.0 reduces interval by **20 days**; > 3.0 reduces it by **10 days**.
- **Oil Pressure Impact:** If average oil pressure < 35 PSI reduces interval by **25 days**; < 40 PSI reduces it by **10 days**.
- **Component Wear:** If any aircraft component exceeds **80% wear** of its lifetime limit, reduces interval by **20 days**.
- **Total Flight Hours:** Over 1000 flight hours reduces interval by **20 days**; over 500 hours by **10 days**.
- *Ensures a safe minimum threshold of **7 days** before scheduling.*

---

## 🗄️ Database Design (Entity-Relationship)

```mermaid
erDiagram
    users {
        int user_id PK
        string email UK
        string full_name
        string password_hash
        UserRole role
        timestamp created_at
    }
    aircrafts {
        int aircraft_id PK
        string reg_number UK
        string model
        date manufacture_date
        double total_flight_hours
        date last_maintenance_date
    }
    components {
        int component_id PK
        int aircraft_id FK
        string name
        string serial_number
        date installed_at
        double life_limit_hours
        double current_wear_hours
    }
    telemetry {
        timestamp time PK
        int aircraft_id PK, FK
        string parameter_name PK
        double value
    }
    alerts {
        int alert_id PK
        int aircraft_id FK
        timestamp created_at
        AlertSeverity severity
        string message
        boolean is_acknowledged
    }
    maintenance_schedules {
        int schedule_id PK
        int aircraft_id FK
        date scheduled_date
        string description
        TaskStatus status
        boolean is_predicted
    }
    maintenance_tasks {
        int task_id PK
        int schedule_id FK
        int assigned_user_id FK
        string description
        timestamp completed_at
        boolean is_completed
    }

    aircrafts ||--o{ components : "contains"
    aircrafts ||--o{ telemetry : "tracks"
    aircrafts ||--o{ alerts : "generates"
    aircrafts ||--o{ maintenance_schedules : "schedules"
    maintenance_schedules ||--o{ maintenance_tasks : "contains"
    users ||--o{ maintenance_tasks : "assigns"
```

---

## 📦 Installation & Setup

### Option 1: Docker (Recommended)

Run the application using Docker Compose with zero manual database configuration.

#### Prerequisites
- Docker Engine 20.10+ / Docker Desktop
- Docker Compose v2.0+

#### Quick Start

1. **Configure Environment Variables (Optional):**
   ```bash
   cp .docker.env.example .docker.env
   ```
   *Edit `.docker.env` to customize ports and PostgreSQL credentials if necessary.*

2. **Start Services:**
   ```bash
   # Production mode
   docker-compose up -d

   # Development mode (with hot-reloading)
   docker-compose -f docker-compose.dev.yml up -d

   # Alternately, use the shell scripts (macOS/Linux)
   chmod +x docker-start.sh docker-stop.sh
   ./docker-start.sh dev
   ```

3. **Verify running containers:**
   ```bash
   docker-compose ps
   ```

4. **Shutdown and clean up database volumes:**
   ```bash
   docker-compose down -v
   ```

---

### Option 2: Manual Installation

#### 1. Install Node Dependencies
```bash
npm install
```

#### 2. Local PostgreSQL Setup
Create a new database in PostgreSQL named `aircraft_monitoring`:
```sql
CREATE DATABASE aircraft_monitoring;
```

#### 3. Environment File
Create a `.env` file in the root directory:
```bash
# Windows
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```
Update `DATABASE_URL` inside `.env` to match your local database settings:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/aircraft_monitoring?schema=public"
```

#### 4. Sync Database Schema & Generate Prisma Client
```bash
# Push schema definitions
npm run db:push

# Generate Prisma Client types
npm run db:generate
```

#### 5. Seed Database (Mock Data for Testing)
Prepopulate the database with pre-configured users, aircraft, components, telemetry, and schedules:
```bash
npm run db:seed
```

#### 6. Run Server
```bash
# Development (with hot-reload)
npm run dev

# Production Build & Run
npm run build
npm run start
```

- **API Endpoint:** `http://localhost:3000/api`
- **Swagger Documentation:** `http://localhost:3000/api/docs`

---

## 🚀 API Endpoints

All responses follow a standard envelope schema:
```json
{
  "success": true,
  "data": { ... }
}
```

### 📈 Telemetry Management

#### `POST /api/telemetry`
Accepts a single telemetry record, a batch of telemetry records, or flat IoT client sensor feeds.

- **Standard Single Record:**
  ```json
  {
    "time": "2026-05-20T12:00:00Z",
    "aircraft_id": 1,
    "parameter_name": "engine_temp",
    "value": 115.5
  }
  ```

- **Standard Batch (Max 1000 items):**
  ```json
  [
    {
      "time": "2026-05-20T12:00:00Z",
      "aircraft_id": 1,
      "parameter_name": "vibration",
      "value": 2.4
    },
    {
      "time": "2026-05-20T12:00:00Z",
      "aircraft_id": 1,
      "parameter_name": "oil_pressure",
      "value": 45.1
    }
  ```

- **Flat IoT Client format (Automated resolution):**
  ```json
  {
    "aircraft_id": "AIRCRAFT-001",
    "timestamp": "2026-05-20T12:00:00Z",
    "engine_temp": 125.5,
    "vibration": 5.8,
    "oil_pressure": 28.5
  }
  ```
  *(Sends alerts to database automatically for values above thresholds: Temp > 120.0, Vibration > 5.0, Oil Pressure < 30.0)*

---

### 🔧 Maintenance & Predictive Forecasts

#### `POST /api/maintenance`
Creates a new maintenance schedule or sub-task.

- **Creating a Schedule:**
  ```json
  {
    "schedule": {
      "aircraft_id": 1,
      "scheduled_date": "2026-06-01",
      "description": "Engines Overhaul",
      "status": "pending",
      "is_predicted": false
    }
  }
  ```

- **Creating a Task:**
  ```json
  {
    "task": {
      "schedule_id": 1,
      "assigned_user_id": 2,
      "description": "Inspect turbine exhaust"
    }
  }
  ```

#### `GET /api/maintenance/schedules`
Returns all schedules. Filters: `aircraft_id`, `status` (`pending`, `in_progress`, `completed`, `cancelled`), `is_predicted` (`true`/`false`), and date ranges (`from_date`, `to_date`).
```
GET /api/maintenance/schedules?status=pending&is_predicted=true
```

#### `POST /api/maintenance/generate-forecast/:aircraftId`
Triggers the multi-factor wear-index forecast engine to evaluate physical parameters and generate a predicted maintenance date.
- **Example Response:**
  ```json
  {
    "success": true,
    "message": "Maintenance forecast generated successfully",
    "data": {
      "schedule_id": 4,
      "aircraft_id": 1,
      "scheduled_date": "2026-07-04T00:00:00.000Z",
      "description": "Predicted maintenance based on telemetry analysis. Avg engine temp: 91.4°C, Avg vibration: 1.25, Avg oil pressure: 44.2",
      "status": "pending",
      "is_predicted": true
    },
    "analysis": {
      "days_until_maintenance": 45,
      "forecast_date": "2026-07-04T00:00:00.000Z",
      "factors": {
        "avg_engine_temp": 91.4,
        "avg_vibration": 1.25,
        "avg_oil_pressure": 44.2,
        "critical_components_count": 1,
        "total_flight_hours": 12500.5
      }
    }
  }
  ```

---

### 🚨 Alert Monitoring

#### `GET /api/alerts/:aircraftId`
Retrieve telemetry anomalies and system alarms.
- **Parameters:**
  - `include_acknowledged` (boolean) - Include historical alerts.
  - `severity` (`info` | `warning` | `critical`) - Filter by priority.

---

### 👥 User & Fleet Administration

#### `GET /api/admin/users`
List system technicians and engineers.

#### `PATCH /api/admin/users/:id/role`
Updates roles. Available roles: `admin`, `engineer`, `technician`, `operator`.
```json
{
  "role": "admin"
}
```

---

## 🧪 Seeding & Test Data Configurations

Running `npm run db:seed` provisions three standard users for role-based simulation:

| Email | Full Name | Default Role |
| :--- | :--- | :--- |
| `admin@aircraft-monitoring.local` | Admin User | `admin` |
| `engineer1@aircraft-monitoring.local` | John Engineer | `engineer` |
| `engineer2@aircraft-monitoring.local` | Jane Technician | `technician` |

It also registers **4 Aircraft** (IDs `1` to `4`):
- `1` - `RA-12345` (Boeing 737-800, 12,500.5 hours)
- `2` - `RA-67890` (Airbus A320, 8,500 hours)
- `3` - `RA-11111` (Boeing 777-300ER, 3,200 hours)
- `4` - `AIRCRAFT-001` (Test Aircraft for IoT, 1,000 hours)

---

## 🛠️ Diagnostics & Troubleshooting

Need help? Detailed instructions are available in [DOCKER_TROUBLESHOOTING.md](file:///d:/University/3rdCourse/1stTerm/Code%20Analyz%20and%20Refactoring/API/DOCKER_TROUBLESHOOTING.md).

```bash
# Tail docker logs
docker-compose logs -f api

# Direct database access
docker-compose exec postgres psql -U postgres -d aircraft_monitoring

# Launch Prisma Studio to visually browse databases
npm run db:studio
# (Or within Docker)
docker-compose exec api npx prisma studio
```
