import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export interface CreateMaintenanceScheduleData {
    aircraft_id: number;
    scheduled_date: Date;
    description?: string;
    status?: TaskStatus;
    is_predicted?: boolean;
}
export interface UpdateMaintenanceScheduleData {
    scheduled_date?: Date;
    description?: string;
    status?: TaskStatus;
    is_predicted?: boolean;
}
export interface CreateMaintenanceTaskData {
    schedule_id: number;
    assigned_user_id?: number;
    description: string;
}
export interface MaintenanceScheduleFilters {
    aircraft_id?: number;
    status?: TaskStatus;
    is_predicted?: boolean;
    from_date?: Date;
    to_date?: Date;
}
export declare class MaintenanceService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    createMaintenanceSchedule(data: CreateMaintenanceScheduleData): Promise<{
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
    }>;
    getAircraftMaintenanceSchedules(aircraftId: number): Promise<({
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
    })[]>;
    createMaintenanceTask(data: CreateMaintenanceTaskData): Promise<{
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
    }>;
    updateMaintenanceTaskStatus(taskId: number, isCompleted: boolean): Promise<{
        schedule_id: number;
        description: string;
        assigned_user_id: number | null;
        completed_at: Date | null;
        is_completed: boolean;
        task_id: number;
    }>;
    getMaintenanceTasksBySchedule(scheduleId: number): Promise<({
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
    })[]>;
    getAllMaintenanceSchedules(filters?: MaintenanceScheduleFilters): Promise<({
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
    })[]>;
    getMaintenanceScheduleById(scheduleId: number): Promise<{
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
    }>;
    updateMaintenanceSchedule(scheduleId: number, data: UpdateMaintenanceScheduleData): Promise<{
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
    }>;
    deleteMaintenanceSchedule(scheduleId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    generateMaintenanceForecast(aircraftId: number): Promise<{
        schedule: any;
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
