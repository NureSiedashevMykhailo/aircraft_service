import { Controller, Get, Delete, Patch, Param, Body, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@ApiTags('Administration')
@Controller('admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Returns list of all users without password hashes' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return {
        success: true,
        data: users,
        count: users.length,
      };
    } catch (error: any) {
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user', description: 'Deletes a user by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid user ID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.usersService.remove(id);
      return {
        success: true,
        message: 'User successfully deleted',
        data: user,
      };
    } catch (error: any) {
      if (error.message === 'User not found') {
        throw new HttpException(
          {
            success: false,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/role')
  @ApiOperation({ summary: 'Update user role', description: 'Changes user role to admin, engineer, technician, or operator' })
  @ApiParam({ name: 'id', type: Number, description: 'User ID', example: 1 })
  @ApiBody({ type: UpdateUserRoleDto })
  @ApiResponse({ status: 200, description: 'User role successfully updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
  ) {
    try {
      if (id <= 0) {
        throw new HttpException(
          {
            success: false,
            error: 'Invalid user ID',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.usersService.updateRole(id, updateUserRoleDto.role);
      return {
        success: true,
        message: 'User role successfully updated',
        data: user,
      };
    } catch (error: any) {
      if (error.message === 'User not found') {
        throw new HttpException(
          {
            success: false,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: error.message || 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

