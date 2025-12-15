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
exports.UpdateMaintenanceScheduleDto = exports.CreateMaintenanceDto = exports.MaintenanceTaskDto = exports.MaintenanceScheduleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class MaintenanceScheduleDto {
}
exports.MaintenanceScheduleDto = MaintenanceScheduleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Aircraft ID', example: 1, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], MaintenanceScheduleDto.prototype, "aircraft_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Scheduled maintenance date', example: '2024-02-15', type: String, format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MaintenanceScheduleDto.prototype, "scheduled_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maintenance schedule description', example: 'Planned maintenance' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MaintenanceScheduleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule status', enum: client_1.TaskStatus, example: 'pending', default: 'pending' }),
    (0, class_validator_1.IsEnum)(client_1.TaskStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], MaintenanceScheduleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the schedule is predicted', example: false, default: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], MaintenanceScheduleDto.prototype, "is_predicted", void 0);
class MaintenanceTaskDto {
}
exports.MaintenanceTaskDto = MaintenanceTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maintenance schedule ID', example: 1, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], MaintenanceTaskDto.prototype, "schedule_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Assigned user ID', example: 2, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], MaintenanceTaskDto.prototype, "assigned_user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task description', example: 'Check cooling system', minLength: 1 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], MaintenanceTaskDto.prototype, "description", void 0);
class CreateMaintenanceDto {
}
exports.CreateMaintenanceDto = CreateMaintenanceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data for creating maintenance schedule', type: MaintenanceScheduleDto }),
    __metadata("design:type", MaintenanceScheduleDto)
], CreateMaintenanceDto.prototype, "schedule", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Data for creating maintenance task', type: MaintenanceTaskDto }),
    __metadata("design:type", MaintenanceTaskDto)
], CreateMaintenanceDto.prototype, "task", void 0);
class UpdateMaintenanceScheduleDto {
}
exports.UpdateMaintenanceScheduleDto = UpdateMaintenanceScheduleDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Scheduled maintenance date', example: '2024-02-15', type: String, format: 'date' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceScheduleDto.prototype, "scheduled_date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Maintenance schedule description', example: 'Planned maintenance' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceScheduleDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Schedule status', enum: client_1.TaskStatus, example: 'pending' }),
    (0, class_validator_1.IsEnum)(client_1.TaskStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateMaintenanceScheduleDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether the schedule is predicted', example: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateMaintenanceScheduleDto.prototype, "is_predicted", void 0);
//# sourceMappingURL=create-maintenance.dto.js.map