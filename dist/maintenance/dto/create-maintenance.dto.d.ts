import { TaskStatus } from '@prisma/client';
export declare class MaintenanceScheduleDto {
    aircraft_id: number;
    scheduled_date: string;
    description?: string;
    status?: TaskStatus;
    is_predicted?: boolean;
}
export declare class MaintenanceTaskDto {
    schedule_id: number;
    assigned_user_id?: number;
    description: string;
}
export declare class CreateMaintenanceDto {
    schedule?: MaintenanceScheduleDto;
    task?: MaintenanceTaskDto;
}
export declare class UpdateMaintenanceScheduleDto {
    scheduled_date?: string;
    description?: string;
    status?: TaskStatus;
    is_predicted?: boolean;
}
