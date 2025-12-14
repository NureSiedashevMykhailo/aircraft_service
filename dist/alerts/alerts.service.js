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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AlertsService = class AlertsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAircraftAlerts(aircraftId, includeAcknowledged = false, severity) {
        try {
            const where = {
                aircraft_id: aircraftId,
            };
            if (!includeAcknowledged) {
                where.is_acknowledged = false;
            }
            if (severity) {
                where.severity = severity;
            }
            const alerts = await this.prisma.alert.findMany({
                where,
                orderBy: {
                    created_at: 'desc',
                },
            });
            return alerts;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async createAlert(data) {
        try {
            const alert = await this.prisma.alert.create({
                data: {
                    aircraft_id: data.aircraft_id,
                    severity: data.severity || 'warning',
                    message: data.message,
                    is_acknowledged: false,
                },
                include: {
                    aircraft: {
                        select: {
                            reg_number: true,
                            model: true,
                        },
                    },
                },
            });
            return alert;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new Error('Aircraft not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async acknowledgeAlert(alertId) {
        try {
            const alert = await this.prisma.alert.update({
                where: {
                    alert_id: alertId,
                },
                data: {
                    is_acknowledged: true,
                },
            });
            return alert;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Alert not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map