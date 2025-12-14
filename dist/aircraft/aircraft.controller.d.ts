import { AircraftService } from './aircraft.service';
export declare class AircraftController {
    private readonly aircraftService;
    constructor(aircraftService: AircraftService);
    getAircraftById(id: number): Promise<{
        success: boolean;
        data: {
            components: {
                aircraft_id: number;
                name: string;
                component_id: number;
                serial_number: string | null;
                installed_at: Date;
                life_limit_hours: number;
                current_wear_hours: number;
            }[];
            alerts: {
                aircraft_id: number;
                created_at: Date;
                alert_id: number;
                severity: import(".prisma/client").$Enums.AlertSeverity;
                message: string;
                is_acknowledged: boolean;
            }[];
            maintenanceSchedules: {
                aircraft_id: number;
                description: string | null;
                scheduled_date: Date;
                schedule_id: number;
                status: import(".prisma/client").$Enums.TaskStatus;
                is_predicted: boolean;
            }[];
        } & {
            aircraft_id: number;
            reg_number: string;
            model: string;
            manufacture_date: Date | null;
            total_flight_hours: number;
            last_maintenance_date: Date | null;
        };
    }>;
}
