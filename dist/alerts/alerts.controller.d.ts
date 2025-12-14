import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    getAircraftAlerts(aircraftId: number, includeAcknowledged?: string, severity?: string): Promise<{
        success: boolean;
        data: {
            created_at: Date;
            severity: import(".prisma/client").$Enums.AlertSeverity;
            message: string;
            is_acknowledged: boolean;
            alert_id: number;
            aircraft_id: number;
        }[];
        count: number;
    }>;
}
