import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional, IsBoolean, IsEnum, MinLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '@prisma/client';

export class MaintenanceScheduleDto {
  @ApiProperty({ description: 'Aircraft ID', example: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  aircraft_id: number;

  @ApiProperty({ description: 'Scheduled maintenance date', example: '2024-02-15', type: String, format: 'date' })
  @IsDateString()
  @IsNotEmpty()
  scheduled_date: string;

  @ApiPropertyOptional({ description: 'Maintenance schedule description', example: 'Planned maintenance' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Schedule status', enum: TaskStatus, example: 'pending', default: 'pending' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({ description: 'Whether the schedule is predicted', example: false, default: false })
  @IsBoolean()
  @IsOptional()
  is_predicted?: boolean;
}

export class MaintenanceTaskDto {
  @ApiProperty({ description: 'Maintenance schedule ID', example: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  schedule_id: number;

  @ApiPropertyOptional({ description: 'Assigned user ID', example: 2, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  assigned_user_id?: number;

  @ApiProperty({ description: 'Task description', example: 'Check cooling system', minLength: 1 })
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  description: string;
}

export class CreateMaintenanceDto {
  @ApiPropertyOptional({ description: 'Data for creating maintenance schedule', type: MaintenanceScheduleDto })
  schedule?: MaintenanceScheduleDto;

  @ApiPropertyOptional({ description: 'Data for creating maintenance task', type: MaintenanceTaskDto })
  task?: MaintenanceTaskDto;
}

