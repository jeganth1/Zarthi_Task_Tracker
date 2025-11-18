import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class CreateUserDTO {
    @ApiProperty()
    @IsString({ message: 'Name must be a valid string' })
    @IsNotEmpty({ message: 'Name should not be empty' })
    @Length(2, 24, { message: 'Name must be a 2 to 24 char' })
    name: string

    @ApiProperty()
    @IsEmail({}, { message: 'email must be a valid ' })
    @IsNotEmpty({ message: 'email should not be empty' })
    email: string

    @ApiProperty()
    @IsString({ message: 'userName must be a valid string' })
    @IsNotEmpty({ message: 'userName should not be empty' })
    @Length(2, 10, { message: 'userName must be 2 to 10 char' })
    userName: string

    @ApiProperty()
    @IsString({ message: 'password must be a valid ' })
    @IsNotEmpty({ message: 'password should not be empty' })
    @Length(6, 15, { message: 'password must be 6 to 15 char' })
    password: string

}