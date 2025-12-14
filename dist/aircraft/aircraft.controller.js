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
exports.AircraftController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const aircraft_service_1 = require("./aircraft.service");
let AircraftController = class AircraftController {
    constructor(aircraftService) {
        this.aircraftService = aircraftService;
    }
    async getAircraftById(id) {
        try {
            if (id <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid aircraft ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const aircraft = await this.aircraftService.getAircraftById(id);
            return {
                success: true,
                data: aircraft,
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
exports.AircraftController = AircraftController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aircraft information', description: 'Returns full aircraft information by ID, including components, active alerts, and upcoming maintenance schedules' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'Aircraft ID', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Aircraft information' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid aircraft ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aircraft not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AircraftController.prototype, "getAircraftById", null);
exports.AircraftController = AircraftController = __decorate([
    (0, swagger_1.ApiTags)('Aircrafts'),
    (0, common_1.Controller)('aircrafts'),
    __metadata("design:paramtypes", [aircraft_service_1.AircraftService])
], AircraftController);
//# sourceMappingURL=aircraft.controller.js.map