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
exports.CreateTelemetryDto = exports.TelemetryRecordDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class TelemetryRecordDto {
}
exports.TelemetryRecordDto = TelemetryRecordDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Record timestamp', example: '2024-01-15T10:30:00Z', type: String, format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], TelemetryRecordDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Aircraft ID', example: 1, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TelemetryRecordDto.prototype, "aircraft_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Telemetry parameter name', example: 'engine_temperature', maxLength: 50 }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], TelemetryRecordDto.prototype, "parameter_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Parameter value', example: 85.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], TelemetryRecordDto.prototype, "value", void 0);
class CreateTelemetryDto {
}
exports.CreateTelemetryDto = CreateTelemetryDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TelemetryRecordDto),
    __metadata("design:type", Array)
], CreateTelemetryDto.prototype, "records", void 0);
//# sourceMappingURL=create-telemetry.dto.js.map