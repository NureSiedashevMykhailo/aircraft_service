import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AircraftService {
  constructor(private prisma: PrismaService) {}

  async getAircraftById(aircraftId: number) {
    try {
      const aircraft = await this.prisma.aircraft.findUnique({
        where: {
          aircraft_id: aircraftId,
        },
        include: {
          components: true,
          alerts: {
            where: {
              is_acknowledged: false,
            },
            orderBy: {
              created_at: 'desc',
            },
            take: 10,
          },
          maintenanceSchedules: {
            where: {
              status: {
                in: ['pending', 'in_progress'],
              },
            },
            orderBy: {
              scheduled_date: 'asc',
            },
            take: 5,
          },
        },
      });

      if (!aircraft) {
        throw new Error('Aircraft not found');
      }

      return aircraft;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async getAllAircrafts() {
    try {
      const aircrafts = await this.prisma.aircraft.findMany({
        include: {
          _count: {
            select: {
              alerts: {
                where: {
                  is_acknowledged: false,
                },
              },
              maintenanceSchedules: {
                where: {
                  status: {
                    in: ['pending', 'in_progress'],
                  },
                },
              },
            },
          },
        },
        orderBy: {
          reg_number: 'asc',
        },
      });

      return aircrafts;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }
}

