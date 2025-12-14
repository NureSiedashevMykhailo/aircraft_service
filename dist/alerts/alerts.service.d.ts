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
        created_at: Date;
        severity: import(".prisma/client").$Enums.AlertSeverity;
        message: string;
        is_acknowledged: boolean;
        alert_id: number;
        aircraft_id: number;
    }[]>;
    createAlert(data: CreateAlertData): Promise<{
        aircraft: {
            reg_number: string;
            model: string;
        };
    } & {
        created_at: Date;
        severity: import(".prisma/client").$Enums.AlertSeverity;
        message: string;
        is_acknowledged: boolean;
        alert_id: number;
        aircraft_id: number;
    }>;
    acknowledgeAlert(alertId: number): Promise<{
        created_at: Date;
        severity: import(".prisma/client").$Enums.AlertSeverity;
        message: string;
        is_acknowledged: boolean;
        alert_id: number;
        aircraft_id: number;
    }>;
}
