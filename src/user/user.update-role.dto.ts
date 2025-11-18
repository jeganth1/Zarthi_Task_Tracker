import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from './user.role';


export class UpdateRoleDto {
    @ApiProperty({ enum: RoleEnum })
    @IsEnum(RoleEnum)
    @IsNotEmpty()
    role: RoleEnum;
}
