import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserRoleDto {
  @ApiProperty({ 
    description: 'New user role', 
    enum: UserRole,
    example: 'admin' 
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}

