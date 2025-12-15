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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async findOne(id) {
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async remove(id) {
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('User not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
    async updateRole(id, role) {
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
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new Error('User not found');
                }
                throw new Error(`Database error: ${error.message}`);
            }
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map