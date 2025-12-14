import { AlertsService } from './alerts.service';
export declare class AlertsController {
    private readonly alertsService;
    constructor(alertsService: AlertsService);
    getAircraftAlerts(aircraftId: number, includeAcknowledged?: string, severity?: string): Promise<{
        success: boolean;
        data: {
            aircraft_id: number;
            created_at: Date;
            alert_id: number;
            severity: import(".prisma/client").$Enums.AlertSeverity;
            message: string;
            is_acknowledged: boolean;
        }[];
        count: number;
    }>;
}
