"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const update_user_role_dto_1 = require("./dto/update-user-role.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll() {
        try {
            const users = await this.usersService.findAll();
            return {
                success: true,
                data: users,
                count: users.length,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            if (id <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid user ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await this.usersService.remove(id);
            return {
                success: true,
                message: 'User successfully deleted',
                data: user,
            };
        }
        catch (error) {
            if (error.message === 'User not found') {
                throw new common_1.HttpException({
                    success: false,
                    error: 'User not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateRole(id, updateUserRoleDto) {
        try {
            if (id <= 0) {
                throw new common_1.HttpException({
                    success: false,
                    error: 'Invalid user ID',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await this.usersService.updateRole(id, updateUserRoleDto.role);
            return {
                success: true,
                message: 'User role successfully updated',
                data: user,
            };
        }
        catch (error) {
            if (error.message === 'User not found') {
                throw new common_1.HttpException({
                    success: false,
                    error: 'User not found',
                }, common_1.HttpStatus.NOT_FOUND);
            }
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException({
                success: false,
                error: error.message || 'Internal server error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users', description: 'Returns list of all users without password hashes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of users' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user', description: 'Deletes a user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'User ID', example: 1 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update user role', description: 'Changes user role to admin, engineer, technician, or operator' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'User ID', example: 1 }),
    (0, swagger_1.ApiBody)({ type: update_user_role_dto_1.UpdateUserRoleDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User role successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Validation error' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_role_dto_1.UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateRole", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Administration'),
    (0, common_1.Controller)('admin/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map