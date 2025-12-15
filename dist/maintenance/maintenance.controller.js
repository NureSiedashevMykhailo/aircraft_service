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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const create_maintenance_dto_1 = require("./dto/create-maintenance.dto");
const maintenance_service_1 = require("./maintenance.service");
let MaintenanceController = class MaintenanceController {
    constructor(maintenanceService) {
        this.maintenanceService = maintenanceService;
    }
    async createMaintenance(body) {
        try {
            if (body.schedule) {
                const scheduleData = body.schedule;
                const schedule = await this.maintenanceService.createMaintenanceSchedule({
                    aircraft_id: scheduleData.aircraft_id,
                    scheduled_date: new Date(scheduleData.scheduled_date),
                    description: scheduleData.description,
                    status: scheduleData.status,
                    is_predicted: scheduleData.is_predicted,
                });
                return {
                    success: true,
                    message: 'Maintenance schedule created',
                    data: schedule,
                };
            }
            if (body.task) {
                const taskData = body.task;
                const task = await this.maintenanceService.createMaintenanceTask({
                    schedule_id: taskData.schedule_id,
                    assigned_user_id: taskData.assigned_user_id,
                    description: taskData.description,
                });
                return {
                    success: true,
                    message: 'Maintenance task created',
                    data: task,
                };
            }
            throw new common_1.HttpException({
                success: false,
                error: 'Either "schedule" or "task" must be provided in request body',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.message === 'Aircraft not found' || error.message === 'Schedule or user not found') {
                throw new common_1.HttpException({
                    success: false,
                    error: error.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllSchedules(aircraftId, status, isPredicted, fromDate, toDate) {
        try {
            const filters = {};
            if (aircraftId) {
                filters.aircraft_id = parseInt(aircraftId, 10);
            }
            if (status) {
                filters.status = status;
            }
            if (isPredicted !== undefined) {
                filters.is_predicted = isPredicted === 'true';
            }
            if (fromDate) {
                filters.from_date = new Date(fromDate);
            }
            if (toDate) {
                filters.to_date = new Date(toDate);
            }
            const schedules = await this.maintenanceService.getAllMaintenanceSchedules(Object.keys(filters).length > 0 ? filters : undefined);
            return {
                success: true,
                count: schedules.length,
                data: schedules,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getScheduleById(id) {
        try {
            if (id <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid schedule ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const schedule = await this.maintenanceService.getMaintenanceScheduleById(id);
            return {
                success: true,
                data: schedule,
            };
        }
        catch (error) {
            if (error.message === 'Schedule not found') {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Schedule not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateSchedule(id, updateDto) {
        try {
            if (id <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid schedule ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const schedule = await this.maintenanceService.updateMaintenanceSchedule(id, {
                scheduled_date: updateDto.scheduled_date ? new Date(updateDto.scheduled_date) : undefined,
                description: updateDto.description,
                status: updateDto.status,
                is_predicted: updateDto.is_predicted,
            });
            return {
                success: true,
                message: 'Schedule successfully updated',
                data: schedule,
            };
        }
        catch (error) {
            if (error.message === 'Schedule not found') {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Schedule not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async deleteSchedule(id) {
        try {
            if (id <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid schedule ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.maintenanceService.deleteMaintenanceSchedule(id);
            return {
                success: true,
                message: result.message,
            };
        }
        catch (error) {
            if (error.message === 'Schedule not found') {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Schedule not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async generateForecast(aircraftId) {
        try {
            if (aircraftId <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid aircraft ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const result = await this.maintenanceService.generateMaintenanceForecast(aircraftId);
            return {
                success: true,
                message: 'Maintenance forecast generated successfully',
                data: result.schedule,
                analysis: result.analysis,
            };
        }
        catch (error) {
            if (error.message === 'Aircraft not found') {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Aircraft not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.MaintenanceController = MaintenanceController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create maintenance schedule or task', description: 'Creates either a maintenance schedule or a maintenance task. Request body must contain either "schedule" or "task" object' }),
    (0, swagger_1.ApiBody)({
        description: 'Data for creating maintenance schedule or task',
        type: create_maintenance_dto_1.CreateMaintenanceDto,
        examples: {
            schedule: {
                summary: 'Create maintenance schedule',
                value: {
                    schedule: {
                        aircraft_id: 1,
                        scheduled_date: '2024-02-15',
                        description: 'Planned engine maintenance',
                        status: 'pending',
                        is_predicted: false
                    }
                }
            },
            task: {
                summary: 'Create maintenance task',
                value: {
                    task: {
                        schedule_id: 1,
                        assigned_user_id: 2,
                        description: 'Check cooling system'
                    }
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Schedule/task successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or missing required fields' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aircraft, schedule or user not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_maintenance_dto_1.CreateMaintenanceDto]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "createMaintenance", null);
__decorate([
    (0, common_1.Get)('schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all maintenance schedules', description: 'Retrieve all maintenance schedules with optional filters (aircraft_id, status, is_predicted, date range)' }),
    (0, swagger_1.ApiQuery)({ name: 'aircraft_id', required: false, type: Number, description: 'Filter by aircraft ID' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: client_1.TaskStatus, description: 'Filter by status' }),
    (0, swagger_1.ApiQuery)({ name: 'is_predicted', required: false, type: Boolean, description: 'Filter by predicted flag' }),
    (0, swagger_1.ApiQuery)({ name: 'from_date', required: false, type: String, description: 'Filter schedules from date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'to_date', required: false, type: String, description: 'Filter schedules to date (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of maintenance schedules' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Query)('aircraft_id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('is_predicted')),
    __param(3, (0, common_1.Query)('from_date')),
    __param(4, (0, common_1.Query)('to_date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "getAllSchedules", null);
__decorate([
    (0, common_1.Get)('schedules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get maintenance schedule by ID', description: 'Retrieve a specific maintenance schedule with all related tasks' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Schedule ID', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Maintenance schedule details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schedule not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "getScheduleById", null);
__decorate([
    (0, common_1.Patch)('schedules/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update maintenance schedule', description: 'Update an existing maintenance schedule' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Schedule ID', example: 1 }),
    (0, swagger_1.ApiBody)({ type: create_maintenance_dto_1.UpdateMaintenanceScheduleDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schedule not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_maintenance_dto_1.UpdateMaintenanceScheduleDto]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "updateSchedule", null);
__decorate([
    (0, common_1.Delete)('schedules/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Delete maintenance schedule', description: 'Delete a maintenance schedule and all associated tasks' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Schedule ID', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Schedule successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Schedule not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "deleteSchedule", null);
__decorate([
    (0, common_1.Post)('generate-forecast/:aircraftId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate maintenance forecast',
        description: 'Automatically generate a maintenance forecast based on recent telemetry data, component wear, and flight hours. Creates or updates a predicted maintenance schedule.'
    }),
    (0, swagger_1.ApiParam)({ name: 'aircraftId', type: Number, description: 'Aircraft ID', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Forecast successfully generated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aircraft not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('aircraftId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "generateForecast", null);
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, swagger_1.ApiTags)('Maintenance'),
    (0, common_1.Controller)('maintenance'),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map