import { Body, Controller, HttpCode, HttpException, HttpStatus, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AircraftService } from '../aircraft/aircraft.service';
import { TelemetryRecordDto } from './dto/create-telemetry.dto';
import { IotTelemetryDto } from './dto/iot-telemetry.dto';
import { TelemetryService } from './telemetry.service';

@ApiTags('Telemetry')
@Controller('telemetry')
export class TelemetryController {
  private readonly logger = new Logger(TelemetryController.name);

  constructor(
    private readonly telemetryService: TelemetryService,
    private readonly aircraftService: AircraftService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true, skipMissingProperties: true, forbidNonWhitelisted: false }))
  @ApiOperation({ summary: 'Create telemetry record(s)', description: 'Accepts standard format (TelemetryRecordDto) or IoT format (with timestamp, engine_temp, vibration, oil_pressure)' })
  @ApiBody({ 
    description: 'Telemetry data (single record or array up to 1000 records)',
    schema: {
      oneOf: [
        { $ref: getSchemaPath(TelemetryRecordDto) },
        {
          type: 'array',
          items: { $ref: getSchemaPath(TelemetryRecordDto) },
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
  })
  @ApiResponse({ status: 201, description: 'Record(s) successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error or invalid aircraft ID' })
  @ApiResponse({ status: 404, description: 'Aircraft not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createTelemetry(@Body() body: any) {
    try {
      // Check if it's IoT format (has timestamp and engine_temp/vibration)
      if (this.isIotFormat(body)) {
        return await this.handleIotFormat(body);
      }

      // Check if it's a single record or an array
      if (Array.isArray(body)) {
        if (body.length === 0 || body.length > 1000) {
          throw new HttpException(
            'Array must contain between 1 and 1000 records',
            HttpStatus.BAD_REQUEST,
          );
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
      } else {
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
    } catch (error: any) {
      // Log error details for debugging
      this.logger.error('Telemetry creation error:', error);
      this.logger.error('Error stack:', error.stack);
      this.logger.error('Request body:', JSON.stringify(body, null, 2));

      if (error instanceof HttpException) {
        throw error;
      }
      
      // Handle aircraft not found error
      if (error.message && error.message.includes('Aircraft with ID') && error.message.includes('not found')) {
        throw new HttpException(
          {
            success: false,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
        );
      }
      
      // Handle batch insert with invalid aircraft IDs
      if (error.message && error.message.includes('aircraft IDs not found')) {
        throw new HttpException(
          {
            success: false,
            error: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Check if request body is in IoT format
   */
  private isIotFormat(body: any): boolean {
    return (
      body &&
      typeof body === 'object' &&
      !Array.isArray(body) &&
      'timestamp' in body &&
      ('engine_temp' in body || 'vibration' in body || 'oil_pressure' in body)
    );
  }

  /**
   * Handle IoT format telemetry data
   */
  private async handleIotFormat(body: IotTelemetryDto) {
    // Resolve aircraft_id (can be reg_number string or numeric ID)
    let aircraftId: number;
    
    if (typeof body.aircraft_id === 'string') {
      // Try to find aircraft by registration number
      try {
        this.logger.debug(`Looking for aircraft with reg_number: ${body.aircraft_id}`);
        const aircraft = await this.aircraftService.getAircraftByRegNumber(body.aircraft_id);
        aircraftId = aircraft.aircraft_id;
        this.logger.debug(`Found aircraft: ID=${aircraftId}, reg_number=${aircraft.reg_number}`);
      } catch (error: any) {
        this.logger.error(`Failed to find aircraft with reg_number "${body.aircraft_id}": ${error.message}`);
        throw new HttpException(
          {
            success: false,
            error: `Aircraft with registration number "${body.aircraft_id}" not found. Please run 'npm run db:seed' to create test data.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      aircraftId = body.aircraft_id;
    }

    // Parse timestamp
    const time = new Date(body.timestamp);
    if (isNaN(time.getTime())) {
      throw new HttpException(
        {
          success: false,
          error: 'Invalid timestamp format',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Convert IoT format to standard format (multiple records)
    const records: Array<{
      time: Date;
      aircraft_id: number;
      parameter_name: string;
      value: number;
    }> = [];

    // Parameter name mapping: IoT format -> database format
    const parameterMap: Record<string, string> = {
      engine_temp: 'engine_temp',
      vibration: 'vibration',
      oil_pressure: 'oil_pressure',
    };

    // Add each parameter as a separate record
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
      throw new HttpException(
        {
          success: false,
          error: 'No telemetry parameters provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create telemetry records
    const result = await this.telemetryService.createTelemetryRecords(records);

    return {
      success: true,
      message: `Created ${result.count} telemetry records from IoT data`,
      count: result.count,
    };
  }
}

