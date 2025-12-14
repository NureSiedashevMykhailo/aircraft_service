import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TaskStatus } from '@prisma/client';

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

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  async createMaintenanceSchedule(data: CreateMaintenanceScheduleData) {
    try {
      const schedule = await this.prisma.maintenanceSchedule.create({
        data: {
          aircraft_id: data.aircraft_id,
          scheduled_date: data.scheduled_date,
          description: data.description,
          status: data.status || 'pending',
          is_predicted: data.is_predicted || false,
        },
        include: {
          aircraft: {
            select: {
              reg_number: true,
              model: true,
            },
          },
        },
      });
      return schedule;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error('Aircraft not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async getAircraftMaintenanceSchedules(aircraftId: number) {
    try {
      const schedules = await this.prisma.maintenanceSchedule.findMany({
        where: {
          aircraft_id: aircraftId,
        },
        include: {
          maintenanceTasks: {
            include: {
              assignedUser: {
                select: {
                  user_id: true,
                  full_name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          scheduled_date: 'desc',
        },
      });
      return schedules;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async createMaintenanceTask(data: CreateMaintenanceTaskData) {
    try {
      const task = await this.prisma.maintenanceTask.create({
        data: {
          schedule_id: data.schedule_id,
          assigned_user_id: data.assigned_user_id,
          description: data.description,
          is_completed: false,
        },
        include: {
          schedule: {
            include: {
              aircraft: {
                select: {
                  reg_number: true,
                  model: true,
                },
              },
            },
          },
          assignedUser: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
            },
          },
        },
      });
      return task;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new Error('Schedule or user not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async updateMaintenanceTaskStatus(taskId: number, isCompleted: boolean) {
    try {
      const task = await this.prisma.maintenanceTask.update({
        where: {
          task_id: taskId,
        },
        data: {
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date() : null,
        },
      });
      return task;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Task not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async getMaintenanceTasksBySchedule(scheduleId: number) {
    try {
      const tasks = await this.prisma.maintenanceTask.findMany({
        where: {
          schedule_id: scheduleId,
        },
        include: {
          assignedUser: {
            select: {
              user_id: true,
              full_name: true,
              email: true,
            },
          },
        },
        orderBy: {
          task_id: 'asc',
        },
      });
      return tasks;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }
}

