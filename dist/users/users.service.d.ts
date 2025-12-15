import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        role: import(".prisma/client").$Enums.UserRole;
    }[]>;
    findOne(id: number): Promise<{
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    remove(id: number): Promise<{
        user_id: number;
        email: string;
        full_name: string;
    }>;
    updateRole(id: number, role: UserRole): Promise<{
        created_at: Date;
        user_id: number;
        email: string;
        full_name: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
}
