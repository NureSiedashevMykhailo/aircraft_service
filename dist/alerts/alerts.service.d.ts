import { PrismaService } from '../prisma/prisma.service';
import { AlertSeverity } from '@prisma/client';
export interface CreateAlertData {
    aircraft_id: number;
    severity?: AlertSeverity;
    message: string;
}
export declare class AlertsService {
    private prisma;
    constructor(prisma: PrismaService);
    getAircraftAlerts(aircraftId: number, includeAcknowledged?: boolean, severity?: AlertSeverity): Promise<{
        aircraft_id: number;
        created_at: Date;
        alert_id: number;
        severity: import(".prisma/client").$Enums.AlertSeverity;
        message: string;
        is_acknowledged: boolean;
    }[]>;
    createAlert(data: CreateAlertData): Promise<{
        aircraft: {
            reg_number: string;
            model: string;
        };
    } & {
        aircraft_id: number;
        created_at: Date;
        alert_id: number;
        severity: import(".prisma/client").$Enums.AlertSeverity;
        message: string;
        is_acknowledged: boolean;
    }>;
    acknowledgeAlert(alertId: number): Promise<{
        aircraft_id: number;
        created_at: Date;
        alert_id: number;
        severity: import(".prisma/client").$Enums.AlertSeverity;
        message: string;
        is_acknowledged: boolean;
    }>;
}
