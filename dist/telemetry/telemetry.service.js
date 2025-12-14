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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let TelemetryService = class TelemetryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTelemetryRecord(data) {
        try {
            const record = await this.prisma.telemetry.create({
                data: {
                    time: data.time,
                    aircraft_id: data.aircraft_id,
                    parameter_name: data.parameter_name,
                    value: data.value,
                },
            });
            return record;
        }
        catch (error) {
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
exports.TelemetryService = TelemetryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TelemetryService);
//# sourceMappingURL=telemetry.service.js.map