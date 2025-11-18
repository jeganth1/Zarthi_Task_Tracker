import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator"

export class CreateTeamDto {
    @ApiProperty({ example: 'TWC Back-Backend' })
    @IsString({ message: 'Name must be a valid string' })
    @IsNotEmpty({ message: 'Name should not be empty' })
    @Length(2, 24, { message: 'Name must be a 2 to 24 char' })
    teamName: string

    @ApiProperty({ example: 'TWCBE' })
    @IsString({ message: 'teamCode must be a valid string' })
    @IsNotEmpty({ message: 'teamCode should not be empty' })
    @Length(2, 10, { message: 'teamCode must be a 2 to 10 char' })
    teamCode: string

    @ApiPropertyOptional({ example: 'team is organised for TWC backend' })
    @IsString({ message: 'teamCode must be a valid string' })
    @Length(2, 100, { message: 'teamCode must be a 2 to 100 char' })
    description?: string

    @ApiPropertyOptional({ example: 'uuid1', })
    @IsUUID()
    createdById: string

    @IsUUID()
    @IsOptional()
    @ApiPropertyOptional({ example: 'uuid1', })
    teamLeadId?: string

    @IsArray()
    @IsUUID('all', { each: true })
    @IsOptional()
    @ApiPropertyOptional({ example: ['uuid1', 'uuid2'], })
    membersIds?: string[]

}