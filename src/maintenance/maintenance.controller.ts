import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';
import { CreateMaintenanceDto, MaintenanceScheduleDto, MaintenanceTaskDto, UpdateMaintenanceScheduleDto } from './dto/create-maintenance.dto';
import { MaintenanceService } from './maintenance.service';

@ApiTags('Maintenance')
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create maintenance schedule or task', description: 'Creates either a maintenance schedule or a maintenance task. Request body must contain either "schedule" or "task" object' })
  @ApiBody({ 
    description: 'Data for creating maintenance schedule or task',
    type: CreateMaintenanceDto,
    examples: {
      schedule: {
        summary: 'Create maintenance schedule',
        value: {
          schedule: {
            aircraft_id: 1,
            scheduled_date: '2024-02-15',
            description: 'Planned engine maintenance',
            status: 'pending',
            is_predicted: false
          }
        }
      },
      task: {
        summary: 'Create maintenance task',
        value: {
          task: {
            schedule_id: 1,
            assigned_user_id: 2,
            description: 'Check cooling system'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Schedule/task successfully created' })
  @ApiResponse({ status: 400, description: 'Validation error or missing required fields' })
  @ApiResponse({ status: 404, description: 'Aircraft, schedule or user not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createMaintenance(@Body() body: CreateMaintenanceDto) {
    try {
      // If schedule exists, create schedule
      if (body.schedule) {
        const scheduleData = body.schedule as MaintenanceScheduleDto;
        const schedule = await this.maintenanceService.createMaintenanceSchedule({
          aircraft_id: scheduleData.aircraft_id,
          scheduled_date: new Date(scheduleData.scheduled_date),
          description: scheduleData.description,
          status: scheduleData.status,
          is_predicted: scheduleData.is_predicted,
        });

        return {
          success: true,
          message: 'Maintenance schedule created',
          data: schedule,
        };
      }

      // If task exists, create task
      if (body.task) {
        const taskData = body.task as MaintenanceTaskDto;
        const task = await this.maintenanceService.createMaintenanceTask({
          schedule_id: taskData.schedule_id,
          assigned_user_id: taskData.assigned_user_id,
          description: taskData.description,
        });

        return {
          success: true,
          message: 'Maintenance task created',
          data: task,
        };
      }

      throw new HttpException(
        {
          success: false,
          error: 'Either "schedule" or "task" must be provided in request body',
        },
        HttpStatus.BAD_REQUEST,
      );
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.message === 'Aircraft not found' || error.message === 'Schedule or user not found') {
        throw new HttpException(
          {
            success: false,
            error: error.message,
          },
          HttpStatus.NOT_FOUND,
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

  @Get('schedules')
  @ApiOperation({ summary: 'Get all maintenance schedules', description: 'Retrieve all maintenance schedules with optional filters (aircraft_id, status, is_predicted, date range)' })
  @ApiQuery({ name: 'aircraft_id', required: false, type: Number, description: 'Filter by aircraft ID' })
  @ApiQuery({ name: 'status', required: false, enum: TaskStatus, description: 'Filter by status' })
  @ApiQuery({ name: 'is_predicted', required: false, type: Boolean, description: 'Filter by predicted flag' })
  @ApiQuery({ name: 'from_date', required: false, type: String, description: 'Filter schedules from date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'to_date', required: false, type: String, description: 'Filter schedules to date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'List of maintenance schedules' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAllSchedules(
    @Query('aircraft_id') aircraftId?: string,
    @Query('status') status?: TaskStatus,
    @Query('is_predicted') isPredicted?: string,
    @Query('from_date') fromDate?: string,
    @Query('to_date') toDate?: string,
  ) {
    try {
      const filters: any = {};

      if (aircraftId) {
        filters.aircraft_id = parseInt(aircraftId, 10);
      }

      if (status) {
        filters.status = status;
      }

      if (isPredicted !== undefined) {
        filters.is_predicted = isPredicted === 'true';
      }

      if (fromDate) {
        filters.from_date = new Date(fromDate);
      }

      if (toDate) {
        filters.to_date = new Date(toDate);
      }

      const schedules = await this.maintenanceService.getAllMaintenanceSchedules(
        Object.keys(filters).length > 0 ? filters : undefined,
      );

      return {
        success: true,
        count: schedules.length,
        data: schedules,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('schedules/:id')
  @ApiOperation({ summary: 'Get maintenance schedule by ID', description: 'Retrieve a specific maintenance schedule with all related tasks' })
  @ApiParam({ name: 'id', type: Number, description: 'Schedule ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Maintenance schedule details' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getScheduleById(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid schedule ID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const schedule = await this.maintenanceService.getMaintenanceScheduleById(id);

      return {
        success: true,
        data: schedule,
      };
    } catch (error: any) {
      if (error.message === 'Schedule not found') {
        throw new HttpException(
          {
            success: false,
            error: 'Schedule not found',
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

  @Patch('schedules/:id')
  @ApiOperation({ summary: 'Update maintenance schedule', description: 'Update an existing maintenance schedule' })
  @ApiParam({ name: 'id', type: Number, description: 'Schedule ID', example: 1 })
  @ApiBody({ type: UpdateMaintenanceScheduleDto })
  @ApiResponse({ status: 200, description: 'Schedule successfully updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateSchedule(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateMaintenanceScheduleDto,
  ) {
    try {
      if (id <= 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid schedule ID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const schedule = await this.maintenanceService.updateMaintenanceSchedule(id, {
        scheduled_date: updateDto.scheduled_date ? new Date(updateDto.scheduled_date) : undefined,
        description: updateDto.description,
        status: updateDto.status,
        is_predicted: updateDto.is_predicted,
      });

      return {
        success: true,
        message: 'Schedule successfully updated',
        data: schedule,
      };
    } catch (error: any) {
      if (error.message === 'Schedule not found') {
        throw new HttpException(
          {
            success: false,
            error: 'Schedule not found',
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

  @Delete('schedules/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete maintenance schedule', description: 'Delete a maintenance schedule and all associated tasks' })
  @ApiParam({ name: 'id', type: Number, description: 'Schedule ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Schedule successfully deleted' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async deleteSchedule(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid schedule ID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.maintenanceService.deleteMaintenanceSchedule(id);

      return {
        success: true,
        message: result.message,
      };
    } catch (error: any) {
      if (error.message === 'Schedule not found') {
        throw new HttpException(
          {
            success: false,
            error: 'Schedule not found',
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

  @Post('generate-forecast/:aircraftId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Generate maintenance forecast', 
    description: 'Automatically generate a maintenance forecast based on recent telemetry data, component wear, and flight hours. Creates or updates a predicted maintenance schedule.' 
  })
  @ApiParam({ name: 'aircraftId', type: Number, description: 'Aircraft ID', example: 1 })
  @ApiResponse({ status: 201, description: 'Forecast successfully generated' })
  @ApiResponse({ status: 404, description: 'Aircraft not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async generateForecast(@Param('aircraftId', ParseIntPipe) aircraftId: number) {
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

      const result = await this.maintenanceService.generateMaintenanceForecast(aircraftId);

      return {
        success: true,
        message: 'Maintenance forecast generated successfully',
        data: result.schedule,
        analysis: result.analysis,
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

