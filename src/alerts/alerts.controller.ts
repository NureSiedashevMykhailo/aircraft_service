import { Controller, Get, Param, Query, ParseIntPipe, ParseBoolPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { AlertSeverity } from '@prisma/client';

@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get(':aircraftId')
  @ApiOperation({ summary: 'Get aircraft alerts', description: 'Returns list of alerts for specified aircraft. By default, only unacknowledged alerts are returned' })
  @ApiParam({ name: 'aircraftId', type: Number, description: 'Aircraft ID', example: 1 })
  @ApiQuery({ name: 'include_acknowledged', required: false, type: Boolean, description: 'Include acknowledged alerts', example: false })
  @ApiQuery({ name: 'severity', required: false, enum: ['info', 'warning', 'critical'], description: 'Filter by severity level', example: 'critical' })
  @ApiResponse({ status: 200, description: 'List of alerts' })
  @ApiResponse({ status: 400, description: 'Invalid aircraft ID' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAircraftAlerts(
    @Param('aircraftId', ParseIntPipe) aircraftId: number,
    @Query('include_acknowledged') includeAcknowledged?: string,
    @Query('severity') severity?: string,
  ) {
    try {
      if (aircraftId <= 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid aircraft ID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const includeAck = includeAcknowledged === 'true';
      const severityEnum = severity as AlertSeverity | undefined;

      const alerts = await this.alertsService.getAircraftAlerts(
        aircraftId,
        includeAck,
        severityEnum,
      );

      return {
        success: true,
        data: alerts,
        count: alerts.length,
      };
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
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

