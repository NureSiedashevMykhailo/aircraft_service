"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TelemetryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const THRESHOLDS = {
    engine_temp: { max: 120.0 },
    vibration: { max: 5.0 },
    oil_pressure: { min: 30.0 },
};
let TelemetryService = TelemetryService_1 = class TelemetryService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(TelemetryService_1.name);
    }
    async checkAnomalyAndCreateAlert(aircraft_id, parameter_name, value) {
        const threshold = THRESHOLDS[parameter_name];
        if (!threshold) {
            return;
        }
        let isAnomaly = false;
        let limitValue;
        let comparison;
        if ('max' in threshold) {
            if (value > threshold.max) {
                isAnomaly = true;
                limitValue = threshold.max;
                comparison = 'max';
            }
        }
        else if ('min' in threshold) {
            if (value < threshold.min) {
                isAnomaly = true;
                limitValue = threshold.min;
                comparison = 'min';
            }
        }
        if (isAnomaly) {
            const message = `Anomaly detected: ${parameter_name} = ${value} (Limit: ${comparison} ${limitValue})`;
            try {
                await this.prisma.alert.create({
                    data: {
                        aircraft_id,
                        severity: 'critical',
                        message,
                        is_acknowledged: false,
                    },
                });
            }
            catch (error) {
                console.error('Failed to create alert:', error);
            }
        }
    }
    async createTelemetryRecord(data) {
        try {
            this.logger.debug(`Creating telemetry record: ${JSON.stringify(data)}`);
            const record = await this.prisma.telemetry.create({
                data: {
                    time: data.time,
                    aircraft_id: data.aircraft_id,
                    parameter_name: data.parameter_name,
                    value: data.value,
                },
            });
            await this.checkAnomalyAndCreateAlert(data.aircraft_id, data.parameter_name, data.value);
            return record;
        }
        catch (error) {
            this.logger.error(`Error creating telemetry record: ${error.message}`, error.stack);
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new Error(`Aircraft with ID ${data.aircraft_id} not found`);
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async createTelemetryRecords(records) {
        try {
            const result = await this.prisma.telemetry.createMany({
                data: records,
                skipDuplicates: true,
            });
            for (const record of records) {
                await this.checkAnomalyAndCreateAlert(record.aircraft_id, record.parameter_name, record.value);
            }
            return result;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    const aircraftIds = [...new Set(records.map(r => r.aircraft_id))];
                    throw new Error(`One or more aircraft IDs not found: ${aircraftIds.join(', ')}`);
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async getAircraftTelemetry(aircraftId, startTime, endTime, parameterName) {
        try {
            const where = {
                aircraft_id: aircraftId,
            };
            if (startTime || endTime) {
                where.time = {};
                if (startTime)
                    where.time.gte = startTime;
                if (endTime)
                    where.time.lte = endTime;
            }
            if (parameterName) {
                where.parameter_name = parameterName;
            }
            const records = await this.prisma.telemetry.findMany({
                where,
                orderBy: {
                    time: 'desc',
                },
                take: 1000,
            });
            return records;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async getLatestTelemetry(aircraftId) {
        try {
            const latestRecords = await this.prisma.$queryRaw `
        SELECT DISTINCT ON (parameter_name) 
          time, aircraft_id, parameter_name, value
        FROM telemetry
        WHERE aircraft_id = ${aircraftId}
        ORDER BY parameter_name, time DESC
      `;
            return latestRecords;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.TelemetryService = TelemetryService;
exports.TelemetryService = TelemetryService = TelemetryService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TelemetryService);
//# sourceMappingURL=telemetry.service.js.map