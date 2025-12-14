import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface TelemetryRecord {
  time: Date;
  aircraft_id: number;
  parameter_name: string;
  value: number;
}

@Injectable()
export class TelemetryService {
  constructor(private prisma: PrismaService) {}

  async createTelemetryRecord(data: TelemetryRecord) {
    try {
      const record = await this.prisma.telemetry.create({
        data: {
          time: data.time,
          aircraft_id: data.aircraft_id,
          parameter_name: data.parameter_name,
          value: data.value,
        },
      });
      return record;
    } catch (error) {
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

