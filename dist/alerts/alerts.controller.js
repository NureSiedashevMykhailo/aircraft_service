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
exports.AlertsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const alerts_service_1 = require("./alerts.service");
let AlertsController = class AlertsController {
    constructor(alertsService) {
        this.alertsService = alertsService;
    }
    async getAircraftAlerts(aircraftId, includeAcknowledged, severity) {
        try {
            if (aircraftId <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid aircraft ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const includeAck = includeAcknowledged === 'true';
            const severityEnum = severity;
            const alerts = await this.alertsService.getAircraftAlerts(aircraftId, includeAck, severityEnum);
            return {
                success: true,
                data: alerts,
                count: alerts.length,
            };
        }
        catch (error) {
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
exports.AlertsController = AlertsController;
__decorate([
    (0, common_1.Get)(':aircraftId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aircraft alerts', description: 'Returns list of alerts for specified aircraft. By default, only unacknowledged alerts are returned' }),
    (0, swagger_1.ApiParam)({ name: 'aircraftId', type: Number, description: 'Aircraft ID', example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'include_acknowledged', required: false, type: Boolean, description: 'Include acknowledged alerts', example: false }),
    (0, swagger_1.ApiQuery)({ name: 'severity', required: false, enum: ['info', 'warning', 'critical'], description: 'Filter by severity level', example: 'critical' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of alerts' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid aircraft ID' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('aircraftId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('include_acknowledged')),
    __param(2, (0, common_1.Query)('severity')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], AlertsController.prototype, "getAircraftAlerts", null);
exports.AlertsController = AlertsController = __decorate([
    (0, swagger_1.ApiTags)('Alerts'),
    (0, common_1.Controller)('alerts'),
    __metadata("design:paramtypes", [alerts_service_1.AlertsService])
], AlertsController);
//# sourceMappingURL=alerts.controller.js.map