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
var TelemetryController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const aircraft_service_1 = require("../aircraft/aircraft.service");
const create_telemetry_dto_1 = require("./dto/create-telemetry.dto");
const telemetry_service_1 = require("./telemetry.service");
let TelemetryController = TelemetryController_1 = class TelemetryController {
    constructor(telemetryService, aircraftService) {
        this.telemetryService = telemetryService;
        this.aircraftService = aircraftService;
        this.logger = new common_1.Logger(TelemetryController_1.name);
    }
    async createTelemetry(body) {
        try {
            if (this.isIotFormat(body)) {
                return await this.handleIotFormat(body);
            }
            if (Array.isArray(body)) {
                if (body.length === 0 || body.length > 1000) {
                    throw new common_1.HttpException('Array must contain between 1 and 1000 records', common_1.HttpStatus.BAD_REQUEST);
                }
                const records = body.map((record) => ({
                    time: new Date(record.time),
                    aircraft_id: record.aircraft_id,
                    parameter_name: record.parameter_name,
                    value: record.value,
                }));
                const result = await this.telemetryService.createTelemetryRecords(records);
                return {
                    success: true,
                    message: `Created ${result.count} telemetry records`,
                    count: result.count,
                };
            }
            else {
                const record = await this.telemetryService.createTelemetryRecord({
                    time: new Date(body.time),
                    aircraft_id: body.aircraft_id,
                    parameter_name: body.parameter_name,
                    value: body.value,
                });
                return {
                    success: true,
                    message: 'Telemetry record created',
                    data: record,
                };
            }
        }
        catch (error) {
            this.logger.error('Telemetry creation error:', error);
            this.logger.error('Error stack:', error.stack);
            this.logger.error('Request body:', JSON.stringify(body, null, 2));
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            if (error.message && error.message.includes('Aircraft with ID') && error.message.includes('not found')) {
                throw new common_1.HttpException({
                    success: false,
                    error: error.message,
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (error.message && error.message.includes('aircraft IDs not found')) {
                throw new common_1.HttpException({
                    success: false,
                    error: error.message,
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    isIotFormat(body) {
        return (body &&
            typeof body === 'object' &&
            !Array.isArray(body) &&
            'timestamp' in body &&
            ('engine_temp' in body || 'vibration' in body || 'oil_pressure' in body));
    }
    async handleIotFormat(body) {
        let aircraftId;
        if (typeof body.aircraft_id === 'string') {
            try {
                this.logger.debug(`Looking for aircraft with reg_number: ${body.aircraft_id}`);
                const aircraft = await this.aircraftService.getAircraftByRegNumber(body.aircraft_id);
                aircraftId = aircraft.aircraft_id;
                this.logger.debug(`Found aircraft: ID=${aircraftId}, reg_number=${aircraft.reg_number}`);
            }
            catch (error) {
                this.logger.error(`Failed to find aircraft with reg_number "${body.aircraft_id}": ${error.message}`);
                throw new common_1.HttpException({
                    success: false,
                    error: `Aircraft with registration number "${body.aircraft_id}" not found. Please run 'npm run db:seed' to create test data.`,
                }, common_1.HttpStatus.NOT_FOUND);
            }
        }
        else {
            aircraftId = body.aircraft_id;
        }
        const time = new Date(body.timestamp);
        if (isNaN(time.getTime())) {
            throw new common_1.HttpException({
                success: false,
                error: 'Invalid timestamp format',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const records = [];
        const parameterMap = {
            engine_temp: 'engine_temp',
            vibration: 'vibration',
            oil_pressure: 'oil_pressure',
        };
        if (body.engine_temp !== undefined && body.engine_temp !== null) {
            records.push({
                time,
                aircraft_id: aircraftId,
                parameter_name: parameterMap.engine_temp,
                value: body.engine_temp,
            });
        }
        if (body.vibration !== undefined && body.vibration !== null) {
            records.push({
                time,
                aircraft_id: aircraftId,
                parameter_name: parameterMap.vibration,
                value: body.vibration,
            });
        }
        if (body.oil_pressure !== undefined && body.oil_pressure !== null) {
            records.push({
                time,
                aircraft_id: aircraftId,
                parameter_name: parameterMap.oil_pressure,
                value: body.oil_pressure,
            });
        }
        if (records.length === 0) {
            throw new common_1.HttpException({
                success: false,
                error: 'No telemetry parameters provided',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.telemetryService.createTelemetryRecords(records);
        return {
            success: true,
            message: `Created ${result.count} telemetry records from IoT data`,
            count: result.count,
        };
    }
};
exports.TelemetryController = TelemetryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true, whitelist: true, skipMissingProperties: true, forbidNonWhitelisted: false })),
    (0, swagger_1.ApiOperation)({ summary: 'Create telemetry record(s)', description: 'Accepts standard format (TelemetryRecordDto) or IoT format (with timestamp, engine_temp, vibration, oil_pressure)' }),
    (0, swagger_1.ApiBody)({
        description: 'Telemetry data (single record or array up to 1000 records)',
        schema: {
            oneOf: [
                { $ref: (0, swagger_1.getSchemaPath)(create_telemetry_dto_1.TelemetryRecordDto) },
                {
                    type: 'array',
                    items: { $ref: (0, swagger_1.getSchemaPath)(create_telemetry_dto_1.TelemetryRecordDto) },
                    maxItems: 1000
                }
            ]
        },
        examples: {
            single: {
                summary: 'Single record',
                value: {
                    time: '2024-01-15T10:30:00Z',
                    aircraft_id: 1,
                    parameter_name: 'engine_temperature',
                    value: 85.5
                }
            },
            batch: {
                summary: 'Batch records',
                value: [
                    {
                        time: '2024-01-15T10:30:00Z',
                        aircraft_id: 1,
                        parameter_name: 'engine_temperature',
                        value: 85.5
                    },
                    {
                        time: '2024-01-15T10:30:01Z',
                        aircraft_id: 1,
                        parameter_name: 'fuel_level',
                        value: 75.2
                    }
                ]
            }
        }
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Record(s) successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error or invalid aircraft ID' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Aircraft not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelemetryController.prototype, "createTelemetry", null);
exports.TelemetryController = TelemetryController = TelemetryController_1 = __decorate([
    (0, swagger_1.ApiTags)('Telemetry'),
    (0, common_1.Controller)('telemetry'),
    __metadata("design:paramtypes", [telemetry_service_1.TelemetryService,
        aircraft_service_1.AircraftService])
], TelemetryController);
//# sourceMappingURL=telemetry.controller.js.map