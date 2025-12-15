-- Aircraft Monitoring System Database Schema
-- PostgreSQL 14+
-- Generated from Prisma schema

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS maintenance_tasks CASCADE;
DROP TABLE IF EXISTS maintenance_schedules CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS telemetry CASCADE;
DROP TABLE IF EXISTS components CASCADE;
DROP TABLE IF EXISTS aircrafts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS "UserRole" CASCADE;
DROP TYPE IF EXISTS "TaskStatus" CASCADE;
DROP TYPE IF EXISTS "AlertSeverity" CASCADE;

-- Create ENUM types
CREATE TYPE "UserRole" AS ENUM ('admin', 'engineer', 'technician', 'operator');
CREATE TYPE "TaskStatus" AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
CREATE TYPE "AlertSeverity" AS ENUM ('info', 'warning', 'critical');

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'engineer',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- Create unique index on email
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- ============================================
-- Table: aircrafts
-- ============================================
CREATE TABLE "aircrafts" (
    "aircraft_id" SERIAL NOT NULL,
    "reg_number" VARCHAR(20) NOT NULL,
    "model" VARCHAR(50) NOT NULL,
    "manufacture_date" DATE,
    "total_flight_hours" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "last_maintenance_date" DATE,
    
    CONSTRAINT "aircrafts_pkey" PRIMARY KEY ("aircraft_id")
);

-- Create unique index on reg_number
CREATE UNIQUE INDEX "aircrafts_reg_number_key" ON "aircrafts"("reg_number");

-- ============================================
-- Table: components
-- ============================================
CREATE TABLE "components" (
    "component_id" SERIAL NOT NULL,
    "aircraft_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "serial_number" VARCHAR(50),
    "installed_at" DATE NOT NULL DEFAULT CURRENT_DATE,
    "life_limit_hours" DOUBLE PRECISION NOT NULL,
    "current_wear_hours" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    
    CONSTRAINT "components_pkey" PRIMARY KEY ("component_id")
);

-- Add foreign key constraint
ALTER TABLE "components" 
    ADD CONSTRAINT "components_aircraft_id_fkey" 
    FOREIGN KEY ("aircraft_id") 
    REFERENCES "aircrafts"("aircraft_id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- ============================================
-- Table: telemetry
-- ============================================
CREATE TABLE "telemetry" (
    "time" TIMESTAMP(6) NOT NULL,
    "aircraft_id" INTEGER NOT NULL,
    "parameter_name" VARCHAR(50) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    
    CONSTRAINT "telemetry_pkey" PRIMARY KEY ("time", "aircraft_id", "parameter_name")
);

-- Add foreign key constraint
ALTER TABLE "telemetry" 
    ADD CONSTRAINT "telemetry_aircraft_id_fkey" 
    FOREIGN KEY ("aircraft_id") 
    REFERENCES "aircrafts"("aircraft_id") 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE;

-- Create indexes for better query performance
CREATE INDEX "telemetry_aircraft_id_idx" ON "telemetry"("aircraft_id");
CREATE INDEX "telemetry_time_idx" ON "telemetry"("time");

-- ============================================
-- Table: alerts
-- ============================================
CREATE TABLE "alerts" (
    "alert_id" SERIAL NOT NULL,
    "aircraft_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'warning',
    "message" TEXT NOT NULL,
    "is_acknowledged" BOOLEAN NOT NULL DEFAULT false,
    
    CONSTRAINT "alerts_pkey" PRIMARY KEY ("alert_id")
);

-- Add foreign key constraint
ALTER TABLE "alerts" 
    ADD CONSTRAINT "alerts_aircraft_id_fkey" 
    FOREIGN KEY ("aircraft_id") 
    REFERENCES "aircrafts"("aircraft_id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- ============================================
-- Table: maintenance_schedules
-- ============================================
CREATE TABLE "maintenance_schedules" (
    "schedule_id" SERIAL NOT NULL,
    "aircraft_id" INTEGER NOT NULL,
    "scheduled_date" DATE NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'pending',
    "is_predicted" BOOLEAN NOT NULL DEFAULT false,
    
    CONSTRAINT "maintenance_schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- Add foreign key constraint
ALTER TABLE "maintenance_schedules" 
    ADD CONSTRAINT "maintenance_schedules_aircraft_id_fkey" 
    FOREIGN KEY ("aircraft_id") 
    REFERENCES "aircrafts"("aircraft_id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

-- ============================================
-- Table: maintenance_tasks
-- ============================================
CREATE TABLE "maintenance_tasks" (
    "task_id" SERIAL NOT NULL,
    "schedule_id" INTEGER NOT NULL,
    "assigned_user_id" INTEGER,
    "description" TEXT NOT NULL,
    "completed_at" TIMESTAMP(6),
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    
    CONSTRAINT "maintenance_tasks_pkey" PRIMARY KEY ("task_id")
);

-- Add foreign key constraints
ALTER TABLE "maintenance_tasks" 
    ADD CONSTRAINT "maintenance_tasks_schedule_id_fkey" 
    FOREIGN KEY ("schedule_id") 
    REFERENCES "maintenance_schedules"("schedule_id") 
    ON DELETE CASCADE 
    ON UPDATE CASCADE;

ALTER TABLE "maintenance_tasks" 
    ADD CONSTRAINT "maintenance_tasks_assigned_user_id_fkey" 
    FOREIGN KEY ("assigned_user_id") 
    REFERENCES "users"("user_id") 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;

-- ============================================
-- Comments for documentation
-- ============================================
COMMENT ON TABLE "users" IS 'System users with different roles (admin, engineer, technician, operator)';
COMMENT ON TABLE "aircrafts" IS 'Aircraft registry with registration numbers and flight hours';
COMMENT ON TABLE "components" IS 'Aircraft components with wear tracking';
COMMENT ON TABLE "telemetry" IS 'Time-series telemetry data with composite primary key';
COMMENT ON TABLE "alerts" IS 'System alerts generated from telemetry anomalies';
COMMENT ON TABLE "maintenance_schedules" IS 'Maintenance schedules (planned or predicted)';
COMMENT ON TABLE "maintenance_tasks" IS 'Individual tasks within maintenance schedules';

COMMENT ON COLUMN "users"."role" IS 'User role: admin, engineer, technician, or operator';
COMMENT ON COLUMN "maintenance_schedules"."is_predicted" IS 'True if schedule was generated by forecast algorithm';
COMMENT ON COLUMN "maintenance_schedules"."status" IS 'Schedule status: pending, in_progress, completed, or cancelled';
COMMENT ON COLUMN "alerts"."severity" IS 'Alert severity: info, warning, or critical';
COMMENT ON COLUMN "telemetry"."parameter_name" IS 'Telemetry parameter name (e.g., engine_temp, vibration, oil_pressure)';

-- ============================================
-- End of schema
-- ============================================

