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
exports.IotTelemetryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class IotTelemetryDto {
}
exports.IotTelemetryDto = IotTelemetryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Aircraft registration number or ID', example: 'AIRCRAFT-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IotTelemetryDto.prototype, "aircraft_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Timestamp', example: '2025-12-14T22:10:30.597Z', type: String, format: 'date-time' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], IotTelemetryDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Engine temperature', example: 88.9 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], IotTelemetryDto.prototype, "engine_temp", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Vibration level', example: 1.06 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], IotTelemetryDto.prototype, "vibration", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Oil pressure', example: 45.2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], IotTelemetryDto.prototype, "oil_pressure", void 0);
//# sourceMappingURL=iot-telemetry.dto.js.map