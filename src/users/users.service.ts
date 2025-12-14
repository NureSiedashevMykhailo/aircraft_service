import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all users without password hash
   */
  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          user_id: true,
          email: true,
          full_name: true,
          role: true,
          created_at: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      });
      return users;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get user by ID without password hash
   */
  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          user_id: id,
        },
        select: {
          user_id: true,
          email: true,
          full_name: true,
          role: true,
          created_at: true,
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({
        where: {
          user_id: id,
        },
        select: {
          user_id: true,
          email: true,
          full_name: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('User not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Update user role
   */
  async updateRole(id: number, role: UserRole) {
    try {
      const user = await this.prisma.user.update({
        where: {
          user_id: id,
        },
        data: {
          role,
        },
        select: {
          user_id: true,
          email: true,
          full_name: true,
          role: true,
          created_at: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error('User not found');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      throw error;
    }
  }
}

