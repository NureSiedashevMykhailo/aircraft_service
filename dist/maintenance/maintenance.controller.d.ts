import { TaskStatus } from '@prisma/client';
import { CreateMaintenanceDto, UpdateMaintenanceScheduleDto } from './dto/create-maintenance.dto';
import { MaintenanceService } from './maintenance.service';
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
            scheduled_date: Date;
            schedule_id: number;
            description: string | null;
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
                scheduled_date: Date;
                schedule_id: number;
                description: string | null;
                status: import(".prisma/client").$Enums.TaskStatus;
                is_predicted: boolean;
            };
            assignedUser: {
                user_id: number;
                email: string;
                full_name: string;
            };
        } & {
            schedule_id: number;
            description: string;
            assigned_user_id: number | null;
            completed_at: Date | null;
            is_completed: boolean;
            task_id: number;
        };
    }>;
    getAllSchedules(aircraftId?: string, status?: TaskStatus, isPredicted?: string, fromDate?: string, toDate?: string): Promise<{
        success: boolean;
        count: number;
        data: ({
            aircraft: {
                reg_number: string;
                model: string;
            };
            maintenanceTasks: ({
                assignedUser: {
                    user_id: number;
                    email: string;
                    full_name: string;
                };
            } & {
                schedule_id: number;
                description: string;
                assigned_user_id: number | null;
                completed_at: Date | null;
                is_completed: boolean;
                task_id: number;
            })[];
        } & {
            aircraft_id: number;
            scheduled_date: Date;
            schedule_id: number;
            description: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            is_predicted: boolean;
        })[];
    }>;
    getScheduleById(id: number): Promise<{
        success: boolean;
        data: {
            aircraft: {
                reg_number: string;
                model: string;
            };
            maintenanceTasks: ({
                assignedUser: {
                    user_id: number;
                    email: string;
                    full_name: string;
                };
            } & {
                schedule_id: number;
                description: string;
                assigned_user_id: number | null;
                completed_at: Date | null;
                is_completed: boolean;
                task_id: number;
            })[];
        } & {
            aircraft_id: number;
            scheduled_date: Date;
            schedule_id: number;
            description: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            is_predicted: boolean;
        };
    }>;
    updateSchedule(id: number, updateDto: UpdateMaintenanceScheduleDto): Promise<{
        success: boolean;
        message: string;
        data: {
            aircraft: {
                reg_number: string;
                model: string;
            };
            maintenanceTasks: ({
                assignedUser: {
                    user_id: number;
                    email: string;
                    full_name: string;
                };
            } & {
                schedule_id: number;
                description: string;
                assigned_user_id: number | null;
                completed_at: Date | null;
                is_completed: boolean;
                task_id: number;
            })[];
        } & {
            aircraft_id: number;
            scheduled_date: Date;
            schedule_id: number;
            description: string | null;
            status: import(".prisma/client").$Enums.TaskStatus;
            is_predicted: boolean;
        };
    }>;
    deleteSchedule(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    generateForecast(aircraftId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
        analysis: {
            days_until_maintenance: number;
            forecast_date: Date;
            factors: {
                avg_engine_temp: number;
                avg_vibration: number;
                avg_oil_pressure: number;
                critical_components_count: number;
                total_flight_hours: number;
            };
        };
    }>;
}
