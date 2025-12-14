import { Controller, Post, Body, HttpCode, HttpStatus, HttpException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto, MaintenanceScheduleDto, MaintenanceTaskDto } from './dto/create-maintenance.dto';

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
}

