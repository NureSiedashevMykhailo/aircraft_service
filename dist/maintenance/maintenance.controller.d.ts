import { MaintenanceService } from './maintenance.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
export declare class MaintenanceController {
    private readonly maintenanceService;
    constructor(maintenanceService: MaintenanceService);
    createMaintenance(body: CreateMaintenanceDto): Promise<{
        success: boolean;
        message: string;
        data: {
            aircraft: {
                reg_number: string;
                model: string;
            };
        } & {
            aircraft_id: number;
            description: string | null;
            scheduled_date: Date;
            schedule_id: number;
            status: import(".prisma/client").$Enums.TaskStatus;
            is_predicted: boolean;
        };
    } | {
        success: boolean;
        message: string;
        data: {
            schedule: {
                aircraft: {
                    reg_number: string;
                    model: string;
                };
            } & {
                aircraft_id: number;
                description: string | null;
                scheduled_date: Date;
                schedule_id: number;
                status: import(".prisma/client").$Enums.TaskStatus;
                is_predicted: boolean;
            };
            assignedUser: {
                user_id: number;
                email: string;
                full_name: string;
            };
        } & {
            description: string;
            schedule_id: number;
            completed_at: Date | null;
            is_completed: boolean;
            task_id: number;
            assigned_user_id: number | null;
        };
    }>;
}
