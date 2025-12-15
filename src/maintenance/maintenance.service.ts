import { Injectable, Logger } from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';
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

@Injectable()
export class MaintenanceService {
  private readonly logger = new Logger(MaintenanceService.name);

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

  /**
   * Get all maintenance schedules with optional filters
   */
  async getAllMaintenanceSchedules(filters?: MaintenanceScheduleFilters) {
    try {
      const where: Prisma.MaintenanceScheduleWhereInput = {};

      if (filters?.aircraft_id) {
        where.aircraft_id = filters.aircraft_id;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.is_predicted !== undefined) {
        where.is_predicted = filters.is_predicted;
      }

      if (filters?.from_date || filters?.to_date) {
        where.scheduled_date = {};
        if (filters.from_date) {
          where.scheduled_date.gte = filters.from_date;
        }
        if (filters.to_date) {
          where.scheduled_date.lte = filters.to_date;
        }
      }

      const schedules = await this.prisma.maintenanceSchedule.findMany({
        where,
        include: {
          aircraft: {
            select: {
              reg_number: true,
              model: true,
            },
          },
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
          scheduled_date: 'asc',
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

  /**
   * Get maintenance schedule by ID
   */
  async getMaintenanceScheduleById(scheduleId: number) {
    try {
      const schedule = await this.prisma.maintenanceSchedule.findUnique({
        where: {
          schedule_id: scheduleId,
        },
        include: {
          aircraft: {
            select: {
              reg_number: true,
              model: true,
            },
          },
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
      });

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      return schedule;
    } catch (error) {
      if (error.message === 'Schedule not found') {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Update maintenance schedule
   */
  async updateMaintenanceSchedule(scheduleId: number, data: UpdateMaintenanceScheduleData) {
    try {
      const schedule = await this.prisma.maintenanceSchedule.update({
        where: {
          schedule_id: scheduleId,
        },
        data: {
          scheduled_date: data.scheduled_date,
          description: data.description,
          status: data.status,
          is_predicted: data.is_predicted,
        },
        include: {
          aircraft: {
            select: {
              reg_number: true,
              model: true,
            },
          },
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
      });
      return schedule;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Schedule not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Delete maintenance schedule
   */
  async deleteMaintenanceSchedule(scheduleId: number) {
    try {
      await this.prisma.maintenanceSchedule.delete({
        where: {
          schedule_id: scheduleId,
        },
      });
      return { success: true, message: 'Schedule deleted successfully' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Schedule not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Generate maintenance forecast based on telemetry data
   * Analyzes recent telemetry and component wear to predict next maintenance date
   */
  async generateMaintenanceForecast(aircraftId: number) {
    try {
      // Get aircraft information
      const aircraft = await this.prisma.aircraft.findUnique({
        where: { aircraft_id: aircraftId },
        include: {
          components: true,
        },
      });

      if (!aircraft) {
        throw new Error('Aircraft not found');
      }

      // Get recent telemetry (last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setHours(oneDayAgo.getHours() - 24);

      const recentTelemetry = await this.prisma.telemetry.findMany({
        where: {
          aircraft_id: aircraftId,
          time: {
            gte: oneDayAgo,
          },
        },
        orderBy: {
          time: 'desc',
        },
        take: 100,
      });

      // Analyze telemetry data
      const engineTempValues = recentTelemetry
        .filter((t) => t.parameter_name === 'engine_temp')
        .map((t) => t.value);
      const vibrationValues = recentTelemetry
        .filter((t) => t.parameter_name === 'vibration')
        .map((t) => t.value);
      const oilPressureValues = recentTelemetry
        .filter((t) => t.parameter_name === 'oil_pressure')
        .map((t) => t.value);

      const avgEngineTemp = engineTempValues.length > 0
        ? engineTempValues.reduce((a, b) => a + b, 0) / engineTempValues.length
        : null;
      const avgVibration = vibrationValues.length > 0
        ? vibrationValues.reduce((a, b) => a + b, 0) / vibrationValues.length
        : null;
      const avgOilPressure = oilPressureValues.length > 0
        ? oilPressureValues.reduce((a, b) => a + b, 0) / oilPressureValues.length
        : null;

      // Calculate forecast based on multiple factors
      let daysUntilMaintenance = 90; // Default: 90 days

      // Factor 1: Engine temperature (higher temp = sooner maintenance)
      if (avgEngineTemp !== null) {
        if (avgEngineTemp > 110) {
          daysUntilMaintenance -= 30; // High temp reduces maintenance interval
        } else if (avgEngineTemp > 100) {
          daysUntilMaintenance -= 15;
        }
      }

      // Factor 2: Vibration (higher vibration = sooner maintenance)
      if (avgVibration !== null) {
        if (avgVibration > 4.0) {
          daysUntilMaintenance -= 20;
        } else if (avgVibration > 3.0) {
          daysUntilMaintenance -= 10;
        }
      }

      // Factor 3: Oil pressure (lower pressure = sooner maintenance)
      if (avgOilPressure !== null) {
        if (avgOilPressure < 35) {
          daysUntilMaintenance -= 25;
        } else if (avgOilPressure < 40) {
          daysUntilMaintenance -= 10;
        }
      }

      // Factor 4: Component wear (check if any component is close to life limit)
      const criticalComponents = aircraft.components.filter(
        (c) => c.current_wear_hours / c.life_limit_hours > 0.8,
      );
      if (criticalComponents.length > 0) {
        daysUntilMaintenance -= 20; // Components near end of life
      }

      // Factor 5: Flight hours (more hours = sooner maintenance)
      if (aircraft.total_flight_hours > 1000) {
        daysUntilMaintenance -= 20;
      } else if (aircraft.total_flight_hours > 500) {
        daysUntilMaintenance -= 10;
      }

      // Ensure minimum 7 days
      daysUntilMaintenance = Math.max(7, daysUntilMaintenance);

      // Calculate forecast date
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + daysUntilMaintenance);

      // Check if forecast already exists
      const existingForecast = await this.prisma.maintenanceSchedule.findFirst({
        where: {
          aircraft_id: aircraftId,
          is_predicted: true,
          scheduled_date: {
            gte: new Date(),
          },
        },
        orderBy: {
          scheduled_date: 'asc',
        },
      });

      let schedule;
      if (existingForecast) {
        // Update existing forecast
        schedule = await this.prisma.maintenanceSchedule.update({
          where: {
            schedule_id: existingForecast.schedule_id,
          },
          data: {
            scheduled_date: forecastDate,
            description: `Predicted maintenance based on telemetry analysis. Avg engine temp: ${avgEngineTemp?.toFixed(1) || 'N/A'}°C, Avg vibration: ${avgVibration?.toFixed(2) || 'N/A'}, Avg oil pressure: ${avgOilPressure?.toFixed(1) || 'N/A'}`,
            status: 'pending',
            is_predicted: true,
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
        this.logger.log(`Updated existing forecast for aircraft ${aircraftId}: ${forecastDate.toISOString()}`);
      } else {
        // Create new forecast
        schedule = await this.prisma.maintenanceSchedule.create({
          data: {
            aircraft_id: aircraftId,
            scheduled_date: forecastDate,
            description: `Predicted maintenance based on telemetry analysis. Avg engine temp: ${avgEngineTemp?.toFixed(1) || 'N/A'}°C, Avg vibration: ${avgVibration?.toFixed(2) || 'N/A'}, Avg oil pressure: ${avgOilPressure?.toFixed(1) || 'N/A'}`,
            status: 'pending',
            is_predicted: true,
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
        this.logger.log(`Created new forecast for aircraft ${aircraftId}: ${forecastDate.toISOString()}`);
      }

      return {
        schedule,
        analysis: {
          days_until_maintenance: daysUntilMaintenance,
          forecast_date: forecastDate,
          factors: {
            avg_engine_temp: avgEngineTemp,
            avg_vibration: avgVibration,
            avg_oil_pressure: avgOilPressure,
            critical_components_count: criticalComponents.length,
            total_flight_hours: aircraft.total_flight_hours,
          },
        },
      };
    } catch (error) {
      this.logger.error(`Error generating forecast for aircraft ${aircraftId}: ${error.message}`);
      if (error.message === 'Aircraft not found') {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }
}

