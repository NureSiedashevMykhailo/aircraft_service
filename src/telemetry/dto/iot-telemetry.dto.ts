import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for IoT client telemetry format
 */
export class IotTelemetryDto {
  @ApiProperty({ description: 'Aircraft registration number or ID', example: 'AIRCRAFT-001' })
  @IsString()
  @IsNotEmpty()
  aircraft_id: string;

  @ApiProperty({ description: 'Timestamp', example: '2025-12-14T22:10:30.597Z', type: String, format: 'date-time' })
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @ApiPropertyOptional({ description: 'Engine temperature', example: 88.9 })
  @IsNumber()
  @IsOptional()
  engine_temp?: number;

  @ApiPropertyOptional({ description: 'Vibration level', example: 1.06 })
  @IsNumber()
  @IsOptional()
  vibration?: number;

  @ApiPropertyOptional({ description: 'Oil pressure', example: 45.2 })
  @IsNumber()
  @IsOptional()
  oil_pressure?: number;
}

