"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const telemetry_controller_1 = require("./telemetry/telemetry.controller");
const telemetry_service_1 = require("./telemetry/telemetry.service");
const aircraft_controller_1 = require("./aircraft/aircraft.controller");
const aircraft_service_1 = require("./aircraft/aircraft.service");
const maintenance_controller_1 = require("./maintenance/maintenance.controller");
const maintenance_service_1 = require("./maintenance/maintenance.service");
const alerts_controller_1 = require("./alerts/alerts.controller");
const alerts_service_1 = require("./alerts/alerts.service");
const users_controller_1 = require("./users/users.controller");
const users_service_1 = require("./users/users.service");
const prisma_service_1 = require("./prisma/prisma.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [
            telemetry_controller_1.TelemetryController,
            aircraft_controller_1.AircraftController,
            maintenance_controller_1.MaintenanceController,
            alerts_controller_1.AlertsController,
            users_controller_1.UsersController,
        ],
        providers: [
            prisma_service_1.PrismaService,
            telemetry_service_1.TelemetryService,
            aircraft_service_1.AircraftService,
            maintenance_service_1.MaintenanceService,
            alerts_service_1.AlertsService,
            users_service_1.UsersService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map