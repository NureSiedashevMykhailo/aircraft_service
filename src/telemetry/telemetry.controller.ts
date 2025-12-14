import { Controller, Post, Body, HttpCode, HttpStatus, HttpException, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, getSchemaPath } from '@nestjs/swagger';
import { TelemetryService } from './telemetry.service';
import { TelemetryRecordDto } from './dto/create-telemetry.dto';

@ApiTags('Telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({ summary: 'Create telemetry record(s)', description: 'Accepts a single telemetry record or an array of records for batch insertion' })
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
  async createTelemetry(@Body() body: TelemetryRecordDto | TelemetryRecordDto[]) {
    try {
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
}

