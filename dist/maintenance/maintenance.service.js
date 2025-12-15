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
var MaintenanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let MaintenanceService = MaintenanceService_1 = class MaintenanceService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(MaintenanceService_1.name);
    }
    async createMaintenanceSchedule(data) {
        try {
            const schedule = await this.prisma.maintenanceSchedule.create({
                data: {
                    aircraft_id: data.aircraft_id,
                    scheduled_date: data.scheduled_date,
                    description: data.description,
                    status: data.status || 'pending',
                    is_predicted: data.is_predicted || false,
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
            return schedule;
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
    async getAircraftMaintenanceSchedules(aircraftId) {
        try {
            const schedules = await this.prisma.maintenanceSchedule.findMany({
                where: {
                    aircraft_id: aircraftId,
                },
                include: {
                    maintenanceTasks: {
                        include: {
                            assignedUser: {
                                select: {
                                    user_id: true,
                                    full_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    scheduled_date: 'desc',
                },
            });
            return schedules;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async createMaintenanceTask(data) {
        try {
            const task = await this.prisma.maintenanceTask.create({
                data: {
                    schedule_id: data.schedule_id,
                    assigned_user_id: data.assigned_user_id,
                    description: data.description,
                    is_completed: false,
                },
                include: {
                    schedule: {
                        include: {
                            aircraft: {
                                select: {
                                    reg_number: true,
                                    model: true,
                                },
                            },
                        },
                    },
                    assignedUser: {
                        select: {
                            user_id: true,
                            full_name: true,
                            email: true,
                        },
                    },
                },
            });
            return task;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2003') {
                    throw new Error('Schedule or user not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async updateMaintenanceTaskStatus(taskId, isCompleted) {
        try {
            const task = await this.prisma.maintenanceTask.update({
                where: {
                    task_id: taskId,
                },
                data: {
                    is_completed: isCompleted,
                    completed_at: isCompleted ? new Date() : null,
                },
            });
            return task;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Task not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async getMaintenanceTasksBySchedule(scheduleId) {
        try {
            const tasks = await this.prisma.maintenanceTask.findMany({
                where: {
                    schedule_id: scheduleId,
                },
                include: {
                    assignedUser: {
                        select: {
                            user_id: true,
                            full_name: true,
                            email: true,
                        },
                    },
                },
                orderBy: {
                    task_id: 'asc',
                },
            });
            return tasks;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async getAllMaintenanceSchedules(filters) {
        try {
            const where = {};
            if (filters?.aircraft_id) {
                where.aircraft_id = filters.aircraft_id;
            }
            if (filters?.status) {
                where.status = filters.status;
            }
            if (filters?.is_predicted !== undefined) {
                where.is_predicted = filters.is_predicted;
            }
            if (filters?.from_date || filters?.to_date) {
                where.scheduled_date = {};
                if (filters.from_date) {
                    where.scheduled_date.gte = filters.from_date;
                }
                if (filters.to_date) {
                    where.scheduled_date.lte = filters.to_date;
                }
            }
            const schedules = await this.prisma.maintenanceSchedule.findMany({
                where,
                include: {
                    aircraft: {
                        select: {
                            reg_number: true,
                            model: true,
                        },
                    },
                    maintenanceTasks: {
                        include: {
                            assignedUser: {
                                select: {
                                    user_id: true,
                                    full_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    scheduled_date: 'asc',
                },
            });
            return schedules;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async getMaintenanceScheduleById(scheduleId) {
        try {
            const schedule = await this.prisma.maintenanceSchedule.findUnique({
                where: {
                    schedule_id: scheduleId,
                },
                include: {
                    aircraft: {
                        select: {
                            reg_number: true,
                            model: true,
                        },
                    },
                    maintenanceTasks: {
                        include: {
                            assignedUser: {
                                select: {
                                    user_id: true,
                                    full_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!schedule) {
                throw new Error('Schedule not found');
            }
            return schedule;
        }
        catch (error) {
            if (error.message === 'Schedule not found') {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async updateMaintenanceSchedule(scheduleId, data) {
        try {
            const schedule = await this.prisma.maintenanceSchedule.update({
                where: {
                    schedule_id: scheduleId,
                },
                data: {
                    scheduled_date: data.scheduled_date,
                    description: data.description,
                    status: data.status,
                    is_predicted: data.is_predicted,
                },
                include: {
                    aircraft: {
                        select: {
                            reg_number: true,
                            model: true,
                        },
                    },
                    maintenanceTasks: {
                        include: {
                            assignedUser: {
                                select: {
                                    user_id: true,
                                    full_name: true,
                                    email: true,
                                },
                            },
                        },
                    },
                },
            });
            return schedule;
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Schedule not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async deleteMaintenanceSchedule(scheduleId) {
        try {
            await this.prisma.maintenanceSchedule.delete({
                where: {
                    schedule_id: scheduleId,
                },
            });
            return { success: true, message: 'Schedule deleted successfully' };
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('Schedule not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async generateMaintenanceForecast(aircraftId) {
        try {
            const aircraft = await this.prisma.aircraft.findUnique({
                where: { aircraft_id: aircraftId },
                include: {
                    components: true,
                },
            });
            if (!aircraft) {
                throw new Error('Aircraft not found');
            }
            const oneDayAgo = new Date();
            oneDayAgo.setHours(oneDayAgo.getHours() - 24);
            const recentTelemetry = await this.prisma.telemetry.findMany({
                where: {
                    aircraft_id: aircraftId,
                    time: {
                        gte: oneDayAgo,
                    },
                },
                orderBy: {
                    time: 'desc',
                },
                take: 100,
            });
            const engineTempValues = recentTelemetry
                .filter((t) => t.parameter_name === 'engine_temp')
                .map((t) => t.value);
            const vibrationValues = recentTelemetry
                .filter((t) => t.parameter_name === 'vibration')
                .map((t) => t.value);
            const oilPressureValues = recentTelemetry
                .filter((t) => t.parameter_name === 'oil_pressure')
                .map((t) => t.value);
            const avgEngineTemp = engineTempValues.length > 0
                ? engineTempValues.reduce((a, b) => a + b, 0) / engineTempValues.length
                : null;
            const avgVibration = vibrationValues.length > 0
                ? vibrationValues.reduce((a, b) => a + b, 0) / vibrationValues.length
                : null;
            const avgOilPressure = oilPressureValues.length > 0
                ? oilPressureValues.reduce((a, b) => a + b, 0) / oilPressureValues.length
                : null;
            let daysUntilMaintenance = 90;
            if (avgEngineTemp !== null) {
                if (avgEngineTemp > 110) {
                    daysUntilMaintenance -= 30;
                }
                else if (avgEngineTemp > 100) {
                    daysUntilMaintenance -= 15;
                }
            }
            if (avgVibration !== null) {
                if (avgVibration > 4.0) {
                    daysUntilMaintenance -= 20;
                }
                else if (avgVibration > 3.0) {
                    daysUntilMaintenance -= 10;
                }
            }
            if (avgOilPressure !== null) {
                if (avgOilPressure < 35) {
                    daysUntilMaintenance -= 25;
                }
                else if (avgOilPressure < 40) {
                    daysUntilMaintenance -= 10;
                }
            }
            const criticalComponents = aircraft.components.filter((c) => c.current_wear_hours / c.life_limit_hours > 0.8);
            if (criticalComponents.length > 0) {
                daysUntilMaintenance -= 20;
            }
            if (aircraft.total_flight_hours > 1000) {
                daysUntilMaintenance -= 20;
            }
            else if (aircraft.total_flight_hours > 500) {
                daysUntilMaintenance -= 10;
            }
            daysUntilMaintenance = Math.max(7, daysUntilMaintenance);
            const forecastDate = new Date();
            forecastDate.setDate(forecastDate.getDate() + daysUntilMaintenance);
            const existingForecast = await this.prisma.maintenanceSchedule.findFirst({
                where: {
                    aircraft_id: aircraftId,
                    is_predicted: true,
                    scheduled_date: {
                        gte: new Date(),
                    },
                },
                orderBy: {
                    scheduled_date: 'asc',
                },
            });
            let schedule;
            if (existingForecast) {
                schedule = await this.prisma.maintenanceSchedule.update({
                    where: {
                        schedule_id: existingForecast.schedule_id,
                    },
                    data: {
                        scheduled_date: forecastDate,
                        description: `Predicted maintenance based on telemetry analysis. Avg engine temp: ${avgEngineTemp?.toFixed(1) || 'N/A'}°C, Avg vibration: ${avgVibration?.toFixed(2) || 'N/A'}, Avg oil pressure: ${avgOilPressure?.toFixed(1) || 'N/A'}`,
                        status: 'pending',
                        is_predicted: true,
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
                this.logger.log(`Updated existing forecast for aircraft ${aircraftId}: ${forecastDate.toISOString()}`);
            }
            else {
                schedule = await this.prisma.maintenanceSchedule.create({
                    data: {
                        aircraft_id: aircraftId,
                        scheduled_date: forecastDate,
                        description: `Predicted maintenance based on telemetry analysis. Avg engine temp: ${avgEngineTemp?.toFixed(1) || 'N/A'}°C, Avg vibration: ${avgVibration?.toFixed(2) || 'N/A'}, Avg oil pressure: ${avgOilPressure?.toFixed(1) || 'N/A'}`,
                        status: 'pending',
                        is_predicted: true,
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
                this.logger.log(`Created new forecast for aircraft ${aircraftId}: ${forecastDate.toISOString()}`);
            }
            return {
                schedule,
                analysis: {
                    days_until_maintenance: daysUntilMaintenance,
                    forecast_date: forecastDate,
                    factors: {
                        avg_engine_temp: avgEngineTemp,
                        avg_vibration: avgVibration,
                        avg_oil_pressure: avgOilPressure,
                        critical_components_count: criticalComponents.length,
                        total_flight_hours: aircraft.total_flight_hours,
                    },
                },
            };
        }
        catch (error) {
            this.logger.error(`Error generating forecast for aircraft ${aircraftId}: ${error.message}`);
            if (error.message === 'Aircraft not found') {
                throw error;
            }
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = MaintenanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map