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
const maintenance_service_1 = require("./maintenance.service");
const create_maintenance_dto_1 = require("./dto/create-maintenance.dto");
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
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, swagger_1.ApiTags)('Maintenance'),
    (0, common_1.Controller)('maintenance'),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map