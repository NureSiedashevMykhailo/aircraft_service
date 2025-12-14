import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@prisma/client';
export interface CreateMaintenanceScheduleData {
    aircraft_id: number;
    scheduled_date: Date;
    description?: string;
    status?: TaskStatus;
    is_predicted?: boolean;
}
export interface CreateMaintenanceTaskData {
    schedule_id: number;
    assigned_user_id?: number;
    description: string;
}
export declare class MaintenanceService {
    private prisma;
    constructor(prisma: PrismaService);
    createMaintenanceSchedule(data: CreateMaintenanceScheduleData): Promise<{
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
    }>;
    getAircraftMaintenanceSchedules(aircraftId: number): Promise<({
        maintenanceTasks: ({
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
        })[];
    } & {
        aircraft_id: number;
        description: string | null;
        scheduled_date: Date;
        schedule_id: number;
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
    }>;
    updateMaintenanceTaskStatus(taskId: number, isCompleted: boolean): Promise<{
        description: string;
        schedule_id: number;
        completed_at: Date | null;
        is_completed: boolean;
        task_id: number;
        assigned_user_id: number | null;
    }>;
    getMaintenanceTasksBySchedule(scheduleId: number): Promise<({
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
    })[]>;
}
