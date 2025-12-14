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
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let MaintenanceService = class MaintenanceService {
    constructor(prisma) {
        this.prisma = prisma;
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
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map