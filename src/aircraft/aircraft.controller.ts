import { Controller, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AircraftService } from './aircraft.service';

@ApiTags('Aircrafts')
@Controller('aircrafts')
export class AircraftController {
  constructor(private readonly aircraftService: AircraftService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get aircraft information', description: 'Returns full aircraft information by ID, including components, active alerts, and upcoming maintenance schedules' })
  @ApiParam({ name: 'id', type: Number, description: 'Aircraft ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Aircraft information' })
  @ApiResponse({ status: 400, description: 'Invalid aircraft ID' })
  @ApiResponse({ status: 404, description: 'Aircraft not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAircraftById(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid aircraft ID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const aircraft = await this.aircraftService.getAircraftById(id);

      return {
        success: true,
        data: aircraft,
      };
    } catch (error: any) {
      if (error.message === 'Aircraft not found') {
        throw new HttpException(
          {
            success: false,
            error: 'Aircraft not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
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

