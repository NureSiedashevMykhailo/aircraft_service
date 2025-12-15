import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface TelemetryRecord {
  time: Date;
  aircraft_id: number;
  parameter_name: string;
  value: number;
}

// Threshold values for anomaly detection
const THRESHOLDS = {
  engine_temp: { max: 120.0 },
  vibration: { max: 5.0 },
  oil_pressure: { min: 30.0 },
} as const;

@Injectable()
export class TelemetryService {
  private readonly logger = new Logger(TelemetryService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Check telemetry value against thresholds and create alert if anomaly detected
   */
  private async checkAnomalyAndCreateAlert(
    aircraft_id: number,
    parameter_name: string,
    value: number,
  ): Promise<void> {
    const threshold = THRESHOLDS[parameter_name as keyof typeof THRESHOLDS];
    
    if (!threshold) {
      return; // No threshold defined for this parameter
    }

    let isAnomaly = false;
    let limitValue: number;
    let comparison: string;

    if ('max' in threshold) {
      if (value > threshold.max) {
        isAnomaly = true;
        limitValue = threshold.max;
        comparison = 'max';
      }
    } else if ('min' in threshold) {
      if (value < threshold.min) {
        isAnomaly = true;
        limitValue = threshold.min;
        comparison = 'min';
      }
    }

    if (isAnomaly) {
      const message = `Anomaly detected: ${parameter_name} = ${value} (Limit: ${comparison} ${limitValue})`;
      
      try {
        await this.prisma.alert.create({
          data: {
            aircraft_id,
            severity: 'critical',
            message,
            is_acknowledged: false,
          },
        });
      } catch (error) {
        // Log error but don't fail the telemetry creation
        console.error('Failed to create alert:', error);
      }
    }
  }

  async createTelemetryRecord(data: TelemetryRecord) {
    try {
      this.logger.debug(`Creating telemetry record: ${JSON.stringify(data)}`);
      
      const record = await this.prisma.telemetry.create({
        data: {
          time: data.time,
          aircraft_id: data.aircraft_id,
          parameter_name: data.parameter_name,
          value: data.value,
        },
      });

      // Check for anomalies and create alert if needed
      await this.checkAnomalyAndCreateAlert(
        data.aircraft_id,
        data.parameter_name,
        data.value,
      );

      return record;
    } catch (error) {
      this.logger.error(`Error creating telemetry record: ${error.message}`, error.stack);
      
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003 = Foreign key constraint failed
        if (error.code === 'P2003') {
          throw new Error(`Aircraft with ID ${data.aircraft_id} not found`);
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async createTelemetryRecords(records: TelemetryRecord[]) {
    try {
      const result = await this.prisma.telemetry.createMany({
        data: records,
        skipDuplicates: true,
      });

      // Check for anomalies and create alerts for each record
      for (const record of records) {
        await this.checkAnomalyAndCreateAlert(
          record.aircraft_id,
          record.parameter_name,
          record.value,
        );
      }

      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2003 = Foreign key constraint failed
        if (error.code === 'P2003') {
          // Extract aircraft_id from error message if possible
          const aircraftIds = [...new Set(records.map(r => r.aircraft_id))];
          throw new Error(`One or more aircraft IDs not found: ${aircraftIds.join(', ')}`);
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async getAircraftTelemetry(
    aircraftId: number,
    startTime?: Date,
    endTime?: Date,
    parameterName?: string,
  ) {
    try {
      const where: Prisma.TelemetryWhereInput = {
        aircraft_id: aircraftId,
      };

      if (startTime || endTime) {
        where.time = {};
        if (startTime) where.time.gte = startTime;
        if (endTime) where.time.lte = endTime;
      }

      if (parameterName) {
        where.parameter_name = parameterName;
      }

      const records = await this.prisma.telemetry.findMany({
        where,
        orderBy: {
          time: 'desc',
        },
        take: 1000,
      });

      return records;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async getLatestTelemetry(aircraftId: number) {
    try {
      const latestRecords = await this.prisma.$queryRaw<
        Array<{
          time: Date;
          aircraft_id: number;
          parameter_name: string;
          value: number;
        }>
      >`
        SELECT DISTINCT ON (parameter_name) 
          time, aircraft_id, parameter_name, value
        FROM telemetry
        WHERE aircraft_id = ${aircraftId}
        ORDER BY parameter_name, time DESC
      `;

      return latestRecords;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }
}

