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
exports.AircraftService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AircraftService = class AircraftService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAircraftById(aircraftId) {
        try {
            const aircraft = await this.prisma.aircraft.findUnique({
                where: {
                    aircraft_id: aircraftId,
                },
                include: {
                    components: true,
                    alerts: {
                        where: {
                            is_acknowledged: false,
                        },
                        orderBy: {
                            created_at: 'desc',
                        },
                        take: 10,
                    },
                    maintenanceSchedules: {
                        where: {
                            status: {
                                in: ['pending', 'in_progress'],
                            },
                        },
                        orderBy: {
                            scheduled_date: 'asc',
                        },
                        take: 5,
                    },
                },
            });
            if (!aircraft) {
                throw new Error('Aircraft not found');
            }
            return aircraft;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async getAllAircrafts() {
        try {
            const aircrafts = await this.prisma.aircraft.findMany({
                include: {
                    _count: {
                        select: {
                            alerts: {
                                where: {
                                    is_acknowledged: false,
                                },
                            },
                            maintenanceSchedules: {
                                where: {
                                    status: {
                                        in: ['pending', 'in_progress'],
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    reg_number: 'asc',
                },
            });
            return aircrafts;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async getAircraftByRegNumber(regNumber) {
        try {
            const aircraft = await this.prisma.aircraft.findUnique({
                where: {
                    reg_number: regNumber,
                },
            });
            if (!aircraft) {
                throw new Error('Aircraft not found');
            }
            return aircraft;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.AircraftService = AircraftService;
exports.AircraftService = AircraftService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AircraftService);
//# sourceMappingURL=aircraft.service.js.map