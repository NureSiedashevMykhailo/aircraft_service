import { IsNotEmpty, IsNumber, IsString, IsDateString, IsArray, ValidateNested, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TelemetryRecordDto {
  @ApiProperty({ description: 'Record timestamp', example: '2024-01-15T10:30:00Z', type: String, format: 'date-time' })
  @IsDateString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ description: 'Aircraft ID', example: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  aircraft_id: number;

  @ApiProperty({ description: 'Telemetry parameter name', example: 'engine_temperature', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  parameter_name: string;

  @ApiProperty({ description: 'Parameter value', example: 85.5 })
  @IsNumber()
  @IsNotEmpty()
  value: number;
}

export class CreateTelemetryDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TelemetryRecordDto)
  records?: TelemetryRecordDto[];
}

