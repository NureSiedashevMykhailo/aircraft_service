import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AlertSeverity } from '@prisma/client';

export interface CreateAlertData {
  aircraft_id: number;
  severity?: AlertSeverity;
  message: string;
}

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async getAircraftAlerts(
    aircraftId: number,
    includeAcknowledged: boolean = false,
    severity?: AlertSeverity,
  ) {
    try {
      const where: Prisma.AlertWhereInput = {
        aircraft_id: aircraftId,
      };

      if (!includeAcknowledged) {
        where.is_acknowledged = false;
      }

      if (severity) {
        where.severity = severity;
      }

      const alerts = await this.prisma.alert.findMany({
        where,
        orderBy: {
          created_at: 'desc',
        },
      });

      return alerts;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  async createAlert(data: CreateAlertData) {
    try {
      const alert = await this.prisma.alert.create({
        data: {
          aircraft_id: data.aircraft_id,
          severity: data.severity || 'warning',
          message: data.message,
          is_acknowledged: false,
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
      return alert;
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

  async acknowledgeAlert(alertId: number) {
    try {
      const alert = await this.prisma.alert.update({
        where: {
          alert_id: alertId,
        },
        data: {
          is_acknowledged: true,
        },
      });
      return alert;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('Alert not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }
}

