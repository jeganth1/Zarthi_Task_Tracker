import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.createDto';
import { UserEntity } from './user.entity';
import { UUID } from 'crypto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/auth/auth.jwt.guard';
import { Roles } from 'src/auth/auth.roles.decorator';
import { RolesGuard } from 'src/auth/auth.roles.guard';
import { UpdateRoleDto } from './user.update-role.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private config: ConfigService) { }

    @Post()
    @ApiOperation({ summary: 'Register the User', description: 'This is open endpoint used to register the user' })
    async createUser(@Body() user: CreateUserDTO){
        return this.userService.createUser(user);
    }

    @ApiOperation({ summary: 'Update the User', description: 'This endpoint is used to Update the user details' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put(':id')
    @ApiParam({ name: 'id', type: String, description: 'User ID (UUID)' })
    async updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() user: CreateUserDTO): Promise<UserEntity | {}> {
        return this.userService.updateUser(user, id);
    }

    @ApiTags('Admin')
    @ApiOperation({ summary: 'Get all user', description: 'This endpoint is used to fetch all the users only accessable to admin' })
    @ApiBearerAuth()
    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async getAllUser() {
        console.log(this.config.get('JWT_SECRET'))
        return this.userService.getAllUSers();
    }


    @ApiTags('Admin')
    @ApiOperation({ summary: 'Delete the user', description: 'This endpoint is used to remove  the users, only accessable to admin' })
    @ApiBearerAuth()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiParam({ name: 'id', type: String, description: 'User ID (UUID)' })
    @Delete(':id')
    async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.userService.deleteUser(id);
    }

    @ApiTags('Admin')
    @ApiOperation({ summary: 'Change the role of the user', description: 'This endpoint is used to change the role of the users, only accessable to admin' })
    @ApiBearerAuth()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Patch(':id/role')
    @ApiParam({ name: 'id', type: String, description: 'User ID (UUID)' })
    @ApiBody({ type: UpdateRoleDto })
    async changeUserRole(
        @Param('id') id: string,
        @Body() body: UpdateRoleDto,
    ) {
        return this.userService.updateUserRole(id, body.role);
    }
}
