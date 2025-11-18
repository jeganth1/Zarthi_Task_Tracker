import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDTO } from './user.createDto';
import { UUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { RoleEnum } from './user.role';
import { failureResponse, successResponse } from 'src/common/response.helper';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async createUser(user: CreateUserDTO) {
        try {
            let newUser = this.userRepository.create(user);
            const saved = await this.userRepository.save(newUser);
            return successResponse(saved.id, 'User created successfully', 201);
        }
        catch (error) {
            return failureResponse('Failed to create user', 500, error.message);
        }
    }

    async createAdminUser(user: CreateUserDTO) {
        try {
            let newUser = this.userRepository.create(user);
            newUser.role = RoleEnum.admin;
            const saved = await this.userRepository.save(newUser);
            return successResponse(saved.id, 'Admin user created', 201);
        } catch (error) {
            return failureResponse('Failed to create admin user', 500, error.message);
        }
    }

    async updateUser(userDto: CreateUserDTO, id: string) {
        let user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return failureResponse(`User with ID ${id} not found`, 404);
        }
        try {
            const updatedUser = Object.assign(user, userDto);
            const saved = await this.userRepository.save(updatedUser);
            return successResponse(saved.id, 'User updated successfully');
        } catch (error) {
            return failureResponse('Failed to update user', 500, error.message);
        }
    }

    async deleteUser(id: string) {
        let user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            return failureResponse(`User with ID ${id} not found`, 404);
        }
        try {
            await this.userRepository.delete(id);
            return successResponse({}, 'User deleted successfully');
        }
        catch (error) {
            return failureResponse('Failed to delete user', 400, error.message);
        }

    }

    async getAllUSers() {
        try {
            const users = await this.userRepository.find();
        
            const responseUsers = users.map(u => ({
                username: u.userName,
                email: u.email,
                role: u.role,
                id: u.id,
                name:u.name

    }));
            return successResponse(responseUsers, 'Users fetched successfully');
        } catch (error) {
            return failureResponse('Failed to fetch users', 400, error.message);
        }
    }


    async findUsersByIds(userIds: string[]): Promise<UserEntity[]> {
        try {
            const users = await this.userRepository.find({
                where: { id: In(userIds) }
            });

            if (users.length !== userIds.length) {
                const foundIds = users.map(u => u.id);
                const missingIds = userIds.filter(id => !foundIds.includes(id));

                throw new BadRequestException(
                    `Invalid user IDs: ${missingIds.join(', ')}`
                );
            }

            return users;
        }
        catch (error) {
            console.log(error)
            throw new Error('internal server error');
        }
    }

    async findUserById(userId: string): Promise<UserEntity> {
        try {
            const user = await this.userRepository.findOne({
                where: { id: userId }, relations: [ 'team'],
            });

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            return user;
        }
        catch (error) {
            console.log(error)
            throw new Error('internal server error');
        }
    }

    async findByUsername(username: string): Promise<UserEntity | null> {
        try {
            return await this.userRepository.findOne({ where: { userName: username } });
        }
        catch (error) {
            console.log(error)
            throw new Error('internal server error');
        }
    }

    async findById(id: string): Promise<UserEntity | null> {
        try {
            return await this.userRepository.findOne({ where: { id } });
        }
        catch (error) {
            throw new Error('Password validation failed');

        }
    }

    async validatePassword(user: UserEntity, plainPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(plainPassword, user.password);
        }
        catch (error) {
            throw new Error('internal server error');
        }
    }

    async updateUserRole(userId: string, newRole: RoleEnum) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return failureResponse(`User not found`, 404);
        }
        try {
            user.role = newRole;
            const saved = await this.userRepository.save(user);
            return successResponse(saved.id, 'User role updated successfully');
        } catch (error) {
            return failureResponse('Failed to update role', 400, error.message);
        }   
    }

}


