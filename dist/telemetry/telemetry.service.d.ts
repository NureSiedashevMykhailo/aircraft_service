import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export interface TelemetryRecord {
    time: Date;
    aircraft_id: number;
    parameter_name: string;
    value: number;
}
export declare class TelemetryService {
    private prisma;
    constructor(prisma: PrismaService);
    createTelemetryRecord(data: TelemetryRecord): Promise<{
        time: Date;
        parameter_name: string;
        value: number;
        aircraft_id: number;
    }>;
    createTelemetryRecords(records: TelemetryRecord[]): Promise<Prisma.BatchPayload>;
    getAircraftTelemetry(aircraftId: number, startTime?: Date, endTime?: Date, parameterName?: string): Promise<{
        time: Date;
        parameter_name: string;
        value: number;
        aircraft_id: number;
    }[]>;
    getLatestTelemetry(aircraftId: number): Promise<{
        time: Date;
        aircraft_id: number;
        parameter_name: string;
        value: number;
    }[]>;
}
