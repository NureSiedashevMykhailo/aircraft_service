import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry/telemetry.controller';
import { TelemetryService } from './telemetry/telemetry.service';
import { AircraftController } from './aircraft/aircraft.controller';
import { AircraftService } from './aircraft/aircraft.service';
import { MaintenanceController } from './maintenance/maintenance.controller';
import { MaintenanceService } from './maintenance/maintenance.service';
import { AlertsController } from './alerts/alerts.controller';
import { AlertsService } from './alerts/alerts.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [
    TelemetryController,
    AircraftController,
    MaintenanceController,
    AlertsController,
  ],
  providers: [
    PrismaService,
    TelemetryService,
    AircraftService,
    MaintenanceService,
    AlertsService,
  ],
})
export class AppModule {}

