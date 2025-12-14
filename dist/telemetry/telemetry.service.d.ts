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
    private checkAnomalyAndCreateAlert;
    createTelemetryRecord(data: TelemetryRecord): Promise<{
        aircraft_id: number;
        time: Date;
        parameter_name: string;
        value: number;
    }>;
    createTelemetryRecords(records: TelemetryRecord[]): Promise<Prisma.BatchPayload>;
    getAircraftTelemetry(aircraftId: number, startTime?: Date, endTime?: Date, parameterName?: string): Promise<{
        aircraft_id: number;
        time: Date;
        parameter_name: string;
        value: number;
    }[]>;
    getLatestTelemetry(aircraftId: number): Promise<{
        time: Date;
        aircraft_id: number;
        parameter_name: string;
        value: number;
    }[]>;
}
