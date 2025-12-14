import { Module } from '@nestjs/common';
import { TelemetryController } from './telemetry/telemetry.controller';
import { TelemetryService } from './telemetry/telemetry.service';
import { AircraftController } from './aircraft/aircraft.controller';
import { AircraftService } from './aircraft/aircraft.service';
import { MaintenanceController } from './maintenance/maintenance.controller';
import { MaintenanceService } from './maintenance/maintenance.service';
import { AlertsController } from './alerts/alerts.controller';
import { AlertsService } from './alerts/alerts.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [],
  controllers: [
    TelemetryController,
    AircraftController,
    MaintenanceController,
    AlertsController,
    UsersController,
  ],
  providers: [
    PrismaService,
    TelemetryService,
    AircraftService,
    MaintenanceService,
    AlertsService,
    UsersService,
  ],
})
export class AppModule {}

