import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        success: boolean;
        data: {
            created_at: Date;
            user_id: number;
            email: string;
            full_name: string;
            role: import(".prisma/client").$Enums.UserRole;
        }[];
        count: number;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
        data: {
            user_id: number;
            email: string;
            full_name: string;
        };
    }>;
    updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto): Promise<{
        success: boolean;
        message: string;
        data: {
            created_at: Date;
            user_id: number;
            email: string;
            full_name: string;
            role: import(".prisma/client").$Enums.UserRole;
        };
    }>;
}
