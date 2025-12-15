-- Aircraft Monitoring System - Mock Data
-- PostgreSQL 14+
-- This file contains sample data for testing and development

-- ============================================
-- Clear existing data (optional - uncomment if needed)
-- ============================================
-- TRUNCATE TABLE maintenance_tasks CASCADE;
-- TRUNCATE TABLE maintenance_schedules CASCADE;
-- TRUNCATE TABLE alerts CASCADE;
-- TRUNCATE TABLE telemetry CASCADE;
-- TRUNCATE TABLE components CASCADE;
-- TRUNCATE TABLE aircrafts CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- Reset sequences
ALTER SEQUENCE users_user_id_seq RESTART WITH 1;
ALTER SEQUENCE aircrafts_aircraft_id_seq RESTART WITH 1;
ALTER SEQUENCE components_component_id_seq RESTART WITH 1;
ALTER SEQUENCE alerts_alert_id_seq RESTART WITH 1;
ALTER SEQUENCE maintenance_schedules_schedule_id_seq RESTART WITH 1;
ALTER SEQUENCE maintenance_tasks_task_id_seq RESTART WITH 1;

-- ============================================
-- Insert Users
-- ============================================
INSERT INTO "users" ("email", "full_name", "password_hash", "role", "created_at") VALUES
('admin@aircraft-monitoring.local', 'Admin User', '$2b$10$rQZ8XK5J8XK5J8XK5J8XK5eXK5J8XK5J8XK5J8XK5J8XK5J8XK5J8XK', 'admin', CURRENT_TIMESTAMP),
('engineer1@aircraft-monitoring.local', 'John Engineer', '$2b$10$rQZ8XK5J8XK5J8XK5J8XK5eXK5J8XK5J8XK5J8XK5J8XK5J8XK5J8XK', 'engineer', CURRENT_TIMESTAMP),
('engineer2@aircraft-monitoring.local', 'Jane Technician', '$2b$10$rQZ8XK5J8XK5J8XK5J8XK5eXK5J8XK5J8XK5J8XK5J8XK5J8XK5J8XK', 'technician', CURRENT_TIMESTAMP);

-- ============================================
-- Insert Aircrafts
-- ============================================
INSERT INTO "aircrafts" ("reg_number", "model", "manufacture_date", "total_flight_hours", "last_maintenance_date") VALUES
('RA-12345', 'Boeing 737-800', '2015-06-15', 12500.5, '2024-01-10'),
('RA-67890', 'Airbus A320', '2018-03-20', 8500.0, '2024-02-05'),
('RA-11111', 'Boeing 777-300ER', '2020-11-10', 3200.0, '2024-03-15'),
('AIRCRAFT-001', 'Test Aircraft for IoT', '2023-01-01', 1000.0, '2024-01-01');

-- ============================================
-- Insert Components
-- ============================================
INSERT INTO "components" ("aircraft_id", "name", "serial_number", "installed_at", "life_limit_hours", "current_wear_hours") VALUES
(1, 'Left Engine', 'ENG-L-001', '2020-01-15', 20000.0, 15000.0),
(1, 'Right Engine', 'ENG-R-001', '2020-01-15', 20000.0, 14800.0),
(2, 'Main Landing Gear', 'LG-M-001', '2018-03-20', 15000.0, 8500.0),
(3, 'Navigation System', 'NAV-001', '2020-11-10', 30000.0, 3200.0);

-- ============================================
-- Insert Telemetry Records
-- ============================================
-- Telemetry for aircraft 1 (RA-12345) - 30 records
INSERT INTO "telemetry" ("time", "aircraft_id", "parameter_name", "value") VALUES
-- Engine temperature records (10 records)
(CURRENT_TIMESTAMP - INTERVAL '10 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '9 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '8 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '7 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '6 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '5 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '4 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '3 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '2 minutes', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
(CURRENT_TIMESTAMP - INTERVAL '1 minute', 1, 'engine_temperature', 85.5 + (RANDOM() * 10)),
-- Fuel level records (10 records)
(CURRENT_TIMESTAMP - INTERVAL '10 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '9 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '8 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '7 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '6 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '5 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '4 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '3 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '2 minutes', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
(CURRENT_TIMESTAMP - INTERVAL '1 minute', 1, 'fuel_level', 70.0 + (RANDOM() * 20)),
-- Altitude records (10 records)
(CURRENT_TIMESTAMP - INTERVAL '10 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '9 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '8 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '7 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '6 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '5 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '4 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '3 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '2 minutes', 1, 'altitude', 10000 + (RANDOM() * 5000)),
(CURRENT_TIMESTAMP - INTERVAL '1 minute', 1, 'altitude', 10000 + (RANDOM() * 5000));

-- Telemetry for aircraft 2 (RA-67890) - 10 records
INSERT INTO "telemetry" ("time", "aircraft_id", "parameter_name", "value") VALUES
-- Engine temperature records (5 records)
(CURRENT_TIMESTAMP - INTERVAL '5 minutes', 2, 'engine_temperature', 82.0 + (RANDOM() * 8)),
(CURRENT_TIMESTAMP - INTERVAL '4 minutes', 2, 'engine_temperature', 82.0 + (RANDOM() * 8)),
(CURRENT_TIMESTAMP - INTERVAL '3 minutes', 2, 'engine_temperature', 82.0 + (RANDOM() * 8)),
(CURRENT_TIMESTAMP - INTERVAL '2 minutes', 2, 'engine_temperature', 82.0 + (RANDOM() * 8)),
(CURRENT_TIMESTAMP - INTERVAL '1 minute', 2, 'engine_temperature', 82.0 + (RANDOM() * 8)),
-- Fuel level records (5 records)
(CURRENT_TIMESTAMP - INTERVAL '5 minutes', 2, 'fuel_level', 75.0 + (RANDOM() * 15)),
(CURRENT_TIMESTAMP - INTERVAL '4 minutes', 2, 'fuel_level', 75.0 + (RANDOM() * 15)),
(CURRENT_TIMESTAMP - INTERVAL '3 minutes', 2, 'fuel_level', 75.0 + (RANDOM() * 15)),
(CURRENT_TIMESTAMP - INTERVAL '2 minutes', 2, 'fuel_level', 75.0 + (RANDOM() * 15)),
(CURRENT_TIMESTAMP - INTERVAL '1 minute', 2, 'fuel_level', 75.0 + (RANDOM() * 15));

-- Additional telemetry for testing anomaly detection
-- Add some records with parameters that match the threshold checks
INSERT INTO "telemetry" ("time", "aircraft_id", "parameter_name", "value") VALUES
-- Normal engine_temp values (below 120.0)
(CURRENT_TIMESTAMP - INTERVAL '30 minutes', 1, 'engine_temp', 90.5),
(CURRENT_TIMESTAMP - INTERVAL '29 minutes', 1, 'engine_temp', 95.2),
(CURRENT_TIMESTAMP - INTERVAL '28 minutes', 1, 'engine_temp', 88.7),
-- Normal vibration values (below 5.0)
(CURRENT_TIMESTAMP - INTERVAL '30 minutes', 1, 'vibration', 1.2),
(CURRENT_TIMESTAMP - INTERVAL '29 minutes', 1, 'vibration', 1.5),
(CURRENT_TIMESTAMP - INTERVAL '28 minutes', 1, 'vibration', 0.9),
-- Normal oil_pressure values (above 30.0)
(CURRENT_TIMESTAMP - INTERVAL '30 minutes', 1, 'oil_pressure', 45.0),
(CURRENT_TIMESTAMP - INTERVAL '29 minutes', 1, 'oil_pressure', 42.5),
(CURRENT_TIMESTAMP - INTERVAL '28 minutes', 1, 'oil_pressure', 48.0);

-- ============================================
-- Insert Alerts
-- ============================================
INSERT INTO "alerts" ("aircraft_id", "created_at", "severity", "message", "is_acknowledged") VALUES
(1, CURRENT_TIMESTAMP - INTERVAL '2 hours', 'warning', 'Engine temperature exceeds normal range', false),
(1, CURRENT_TIMESTAMP - INTERVAL '1 day', 'info', 'Scheduled maintenance approaching', true),
(2, CURRENT_TIMESTAMP - INTERVAL '3 hours', 'critical', 'Fuel level below threshold', false);

-- ============================================
-- Insert Maintenance Schedules
-- ============================================
INSERT INTO "maintenance_schedules" ("aircraft_id", "scheduled_date", "description", "status", "is_predicted") VALUES
(1, '2024-02-15', 'Planned engine maintenance', 'pending', false),
(1, '2024-03-20', 'Routine inspection', 'pending', true),
(2, '2024-02-25', 'Landing gear maintenance', 'in_progress', false);

-- ============================================
-- Insert Maintenance Tasks
-- ============================================
INSERT INTO "maintenance_tasks" ("schedule_id", "assigned_user_id", "description", "completed_at", "is_completed") VALUES
(1, 2, 'Check cooling system', NULL, false),
(1, 3, 'Inspect engine components', NULL, false),
(3, 2, 'Replace landing gear components', '2024-02-20 10:00:00', true),
(1, NULL, 'General inspection', NULL, false);

-- ============================================
-- Summary
-- ============================================
-- Users: 3
-- Aircrafts: 4 (RA-12345, RA-67890, RA-11111, AIRCRAFT-001)
-- Components: 4
-- Telemetry records: ~49 (30 for aircraft 1, 10 for aircraft 2, 9 additional for testing)
-- Alerts: 3
-- Maintenance schedules: 3
-- Maintenance tasks: 4

-- ============================================
-- Verification Queries (optional)
-- ============================================
-- SELECT COUNT(*) as user_count FROM users;
-- SELECT COUNT(*) as aircraft_count FROM aircrafts;
-- SELECT COUNT(*) as component_count FROM components;
-- SELECT COUNT(*) as telemetry_count FROM telemetry;
-- SELECT COUNT(*) as alert_count FROM alerts;
-- SELECT COUNT(*) as schedule_count FROM maintenance_schedules;
-- SELECT COUNT(*) as task_count FROM maintenance_tasks;

